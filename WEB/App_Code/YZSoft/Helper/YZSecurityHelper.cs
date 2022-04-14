using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Collections.Generic;
using System.Security.Cryptography;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.X509;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Asn1.Pkcs;
using Org.BouncyCastle.Pkcs;
using BPM;
using BPM.Client;
using BPM.Client.Security;

/// <summary>
/// YZSecurityHelper 的摘要说明

/// </summary>
public class YZSecurityHelper
{
    private static string _securitykey = null;

    public static string SecurityKey
    {
        get
        {
            if (YZSecurityHelper._securitykey == null)
            {
                YZSecurityHelper._securitykey = System.Web.Configuration.WebConfigurationManager.AppSettings["SecurityKey"];
                if (String.IsNullOrEmpty(YZSecurityHelper._securitykey))
                    YZSecurityHelper._securitykey = "2wersd99f81fl09ad";
            }

            return YZSecurityHelper._securitykey;
        }
        set
        {
            YZSecurityHelper._securitykey = value;
        }
    }

    public static string GenHash(List<string> values, string key)
    {
        return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(String.Join(",", values.ToArray()) + key, "SHA1").ToLower();
    }

    public static bool CheckHash(List<string> values, string hash, string key)
    {
        if (String.IsNullOrEmpty(hash))
            return false;

        string hash1 = GenHash(values, key);
        return hash == hash1 ? true:false;
    }

    public static string GenTaskAccessToken(int taskid)
    {
        List<string> values = new List<string>();
        values.Add(taskid.ToString());

        return GenHash(values, YZSecurityHelper.SecurityKey);
    }

    public static bool CheckToken(string value, string token)
    {
        List<string> values = new List<string>();
        values.Add(value);

        return CheckHash(values, token, YZSecurityHelper.SecurityKey);
    }

    public static bool CheckTaskAccessToken(int taskid, string hash)
    {
        List<string> values = new List<string>();
        values.Add(taskid.ToString());

        return CheckHash(values, hash, YZSecurityHelper.SecurityKey);
    }

    public static string GenFormApplicationToken(string app,string key,string formstate)
    {
        List<string> values = new List<string>();
        values.Add(app);
        values.Add(key);
        values.Add(formstate);

        return GenHash(values, YZSecurityHelper.SecurityKey);
    }

    public static string GenFormAccessHash()
    {
        Page page = HttpContext.Current.Handler as Page;

        List<string> values = new List<string>();
        values.Add(String.Format("tid={0}", page.Request.QueryString["tid"]));
        values.Add(String.Format("pid={0}", page.Request.QueryString["pid"]));
        values.Add(String.Format("var={0}", page.Request.QueryString["var"]));
        values.Add(String.Format("share={0}", page.Request.QueryString["share"]));
        values.Add(String.Format("pn={0}", page.Request.QueryString["pn"]));
        values.Add(String.Format("app={0}", page.Request.QueryString["app"]));
        values.Add(String.Format("state={0}", page.Request.QueryString["state"]));
        values.Add(String.Format("key={0}", page.Request.QueryString["key"]));
        values.Add(String.Format("account={0}", YZAuthHelper.LoginUserAccount));

        return YZSecurityHelper.GenHash(values, YZSecurityHelper.SecurityKey);
    }

    public static NodePermision[] ParseNodePermisions(string permString)
    {
        if (String.IsNullOrEmpty(permString))
            return new NodePermision[0];

        List<NodePermision> perms = new List<NodePermision>();
        string[] permNames = permString.Split(',');
        foreach (string permName in permNames)
        {
            NodePermision perm;
            if (!Enum.TryParse<NodePermision>(permName, out perm))
                throw new Exception(String.Format("Invalid NodePermision name:{0}", permName));

            if (!perms.Contains(perm))
                perms.Add(perm);
        }

        return perms.ToArray();
    }

    public static BPMPermision[] ParsePermisions(string permString)
    {
        if (String.IsNullOrEmpty(permString))
            return new BPMPermision[0];

        List<BPMPermision> perms = new List<BPMPermision>();
        string[] permNames = permString.Split(',');
        foreach (string permName in permNames)
        {
            BPMPermision perm;
            if (!Enum.TryParse<BPMPermision>(permName, out perm))
                throw new Exception(String.Format("Invalid BPMPermision name:{0}", permName));

            if (!perms.Contains(perm))
                perms.Add(perm);
        }

        return perms.ToArray();
    }

    public static string GenFileUploadToken()
    {
        string account = YZAuthHelper.LoginUserAccount;
        List<string> values = new List<string>();
        values.Add("FileUploadToken");
        values.Add(account);

        return GenHash(values, YZSecurityHelper.SecurityKey);
    }

    public static bool CheckUploadToken(string account,string token)
    {
        List<string> values = new List<string>();
        values.Add("FileUploadToken");
        values.Add(account);

        return CheckHash(values, token, YZSecurityHelper.SecurityKey);
    }

    public static string GenReadFormToken(int taskid)
    {
        string account = YZAuthHelper.LoginUserAccount;
        List<string> values = new List<string>();
        values.Add("ReadFormToken");
        values.Add(account);
        values.Add(taskid.ToString());

        return GenHash(values, YZSecurityHelper.SecurityKey);
    }

    public static bool CheckReadFormToken(string account, int taskid, string token)
    {
        List<string> values = new List<string>();
        values.Add("ReadFormToken");
        values.Add(account);
        values.Add(taskid.ToString());

        return CheckHash(values, token, YZSecurityHelper.SecurityKey);
    }

    public static string GenRedirectToken(string account)
    {
        List<string> values = new List<string>();
        values.Add("RedirectToken");
        values.Add(account);

        return GenHash(values, YZSecurityHelper.SecurityKey);
    }

    public static bool CheckRedirectToken(string account, string token)
    {
        List<string> values = new List<string>();
        values.Add("RedirectToken");
        values.Add(account);

        return CheckHash(values, token, YZSecurityHelper.SecurityKey);
    }

    /// <summary>
    /// RSA私钥格式转换，PCKS->.net
    /// </summary>
    /// <param name="privateKeyInfoData">java生成的RSA私钥</param>
    /// <returns></returns>
    public static string RSAPrivateKeyPCKS2DotNet(byte[] privateKeyInfoData)
    {
        RsaPrivateCrtKeyParameters privateKeyParam = (RsaPrivateCrtKeyParameters)PrivateKeyFactory.CreateKey(privateKeyInfoData);

        return string.Format("<RSAKeyValue><Modulus>{0}</Modulus><Exponent>{1}</Exponent><P>{2}</P><Q>{3}</Q><DP>{4}</DP><DQ>{5}</DQ><InverseQ>{6}</InverseQ><D>{7}</D></RSAKeyValue>",
            Convert.ToBase64String(privateKeyParam.Modulus.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.PublicExponent.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.P.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.Q.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.DP.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.DQ.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.QInv.ToByteArrayUnsigned()),
            Convert.ToBase64String(privateKeyParam.Exponent.ToByteArrayUnsigned()));
    }

    /// <summary>
    /// RSA私钥格式转换，.net->PCKS
    /// </summary>
    /// <param name="privateKey">.net生成的私钥</param>
    /// <returns></returns>
    public static string RSAPrivateKeyDotNet2PCKS(string privateKey)
    {
        System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
        doc.LoadXml(privateKey);
        BigInteger m = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("Modulus")[0].InnerText));
        BigInteger exp = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("Exponent")[0].InnerText));
        BigInteger d = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("D")[0].InnerText));
        BigInteger p = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("P")[0].InnerText));
        BigInteger q = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("Q")[0].InnerText));
        BigInteger dp = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("DP")[0].InnerText));
        BigInteger dq = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("DQ")[0].InnerText));
        BigInteger qinv = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("InverseQ")[0].InnerText));

        RsaPrivateCrtKeyParameters privateKeyParam = new RsaPrivateCrtKeyParameters(m, exp, d, p, q, dp, dq, qinv);

        PrivateKeyInfo privateKeyInfo = PrivateKeyInfoFactory.CreatePrivateKeyInfo(privateKeyParam);
        byte[] serializedPrivateBytes = privateKeyInfo.ToAsn1Object().GetEncoded();
        return Convert.ToBase64String(serializedPrivateBytes);
    }

    /// <summary>
    /// RSA公钥格式转换，PCKS->.net
    /// </summary>
    /// <param name="keyInfoData">java生成的公钥</param>
    /// <returns></returns>
    public static string RSAPublicKeyPCKS2DotNet(byte[] keyInfoData)
    {
        RsaKeyParameters publicKeyParam = (RsaKeyParameters)PublicKeyFactory.CreateKey(keyInfoData);
        return string.Format("<RSAKeyValue><Modulus>{0}</Modulus><Exponent>{1}</Exponent></RSAKeyValue>",
            Convert.ToBase64String(publicKeyParam.Modulus.ToByteArrayUnsigned()),
            Convert.ToBase64String(publicKeyParam.Exponent.ToByteArrayUnsigned()));
    }

    /// <summary>
    /// RSA公钥格式转换，.net->PCKS
    /// </summary>
    /// <param name="publicKey">.net生成的公钥</param>
    /// <returns></returns>
    public static string RSAPublicKeyDotNet2PCKS(string publicKey)
    {
        System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
        doc.LoadXml(publicKey);
        BigInteger m = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("Modulus")[0].InnerText));
        BigInteger p = new BigInteger(1, Convert.FromBase64String(doc.DocumentElement.GetElementsByTagName("Exponent")[0].InnerText));
        RsaKeyParameters pub = new RsaKeyParameters(false, m, p);

        SubjectPublicKeyInfo publicKeyInfo = SubjectPublicKeyInfoFactory.CreateSubjectPublicKeyInfo(pub);
        byte[] serializedPublicBytes = publicKeyInfo.ToAsn1Object().GetDerEncoded();
        return Convert.ToBase64String(serializedPublicBytes);
    }
}
