using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using YZSoft.Web.DAL;

public class MessageIDType1: SoapHeader
{
    public string[] Text { get; set; }
}
public class aaabbbccc : System.Web.Services.WebService {

    public MySoapHeader header; ////定义用户身份验证类变量header
    public MySoapHeader123 header123; ////定义用户身份验证类变量header

    //public ActionType Action { get; set; }
    //public ToType To { get; set; }
    //public MessageIDType1 MessageID;
    //public ReferenceParametersType ReferenceParameters { get; set; }
    //public ReplyToType ReplyTo { get; set; }
    //public RelatesToType RelatesTo { get; set; }

    public aaabbbccc() {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    //[WebMethod]
    //[SoapHeader("RelatesTo", Direction = SoapHeaderDirection.Out)]
    //[SoapHeader("To", Direction = SoapHeaderDirection.InOut)]
    //[SoapHeader("ReplyTo")]
    //[SoapHeader("ReferenceParameters")]
    //[SoapHeader("Action", Direction = SoapHeaderDirection.InOut)]
    //[SoapHeader("MessageID", Direction = SoapHeaderDirection.InOut)]
    //public WSDLMaintainGeneralizedCodeResponseType processQdocMessage(WSDLMaintainGeneralizedCodeType maintainGeneralizedCode)
    //{
    //    return null;
    //}

    [WebMethod]
    [System.Web.Services.Protocols.SoapHeader("header")]//用户身份验证的soap头
    [System.Web.Services.Protocols.SoapHeader("header123",Direction = SoapHeaderDirection.InOut)]//用户身份验证的soap头
    public string HelloWorld()
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();

        byte[] bytes = new byte[this.Context.Request.InputStream.Length];
        this.Context.Request.InputStream.Seek(0, System.IO.SeekOrigin.Begin);
        this.Context.Request.InputStream.Read(bytes, 0, (int)this.Context.Request.InputStream.Length);
        string strResult = System.Text.Encoding.UTF8.GetString(bytes);

       // header123 = new MySoapHeader123();
        header123.aaa = "aaa";
        return String.Format("Hello World, UserName : {0}, PassWord : {1}", header.UserName, header.PassWord);
    }

    [WebMethod(MessageName = "HelloWorld22")]
    public string HelloWorld(string a)
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();

        byte[] bytes = new byte[this.Context.Request.InputStream.Length];
        this.Context.Request.InputStream.Seek(0, System.IO.SeekOrigin.Begin);
        this.Context.Request.InputStream.Read(bytes, 0, (int)this.Context.Request.InputStream.Length);
        string strResult = System.Text.Encoding.UTF8.GetString(bytes);

        return String.Format("Hello World a " + a);
    }

    [WebMethod]
    public Purchase HelloWorld1(DateTime bbbcccddd,ref int ref1)
    {
        Purchase p = new Purchase();
        p.Reason = "Reason1";
        p.Amount = 123;
        p.PurchaseDetail = new List<PurchaseDetail>();

        //throw new Exception("AAABBBCCC");
        ref1 = 99;
        return p;
        //return "Hello World";
    }

    [WebMethod]
    public Purchase HelloWorld2(DateTime bbbcccddd, ref int ref1, out int out1)
    {
        Purchase p = new Purchase();
        p.Reason = "Reason1";
        p.Amount = 123;
        p.PurchaseDetail = new List<PurchaseDetail>();

        //throw new Exception("AAABBBCCC");
        ref1 = 99;
        out1 = 1;
        return p;
        //return "Hello World";
    }

    [WebMethod]
    public DataTable GetProductList()
    {
        using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
        {
            using (IDbConnection cn = provider.OpenConnection())
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = cn as SqlConnection;
                    cmd.CommandText = "SELECT * FROM iDemoProduct";

                    using (IDataReader reader = cmd.ExecuteReader())
                    {
                        DataTable table = new DataTable("ProductList");
                        table.Load(reader);

                        foreach (DataColumn column in table.Columns)
                            column.MaxLength = -1;

                        return table;
                    }
                }
            }
        }
    }

    //[WebMethod]
    //public List<Purchase> GetProductList1(string type,out string aaa)
    //{
    //    aaa = "aaa value";

    //    Purchase a;
    //    PurchaseDetail b;
    //    List<aaa> rv = new List<aaa>();

    //    a = new aaa();
    //    rv.Add(a);
    //    a.a1 = "a1 value";
    //    a.b1 = new List<bbb>();
    //    b = new bbb();
    //    a.b1.Add(b);
    //    b.b1 = "b11 value";
    //    b.b2 = "b12 value";
    //    b = new bbb();
    //    a.b1.Add(b);
    //    b.b1 = "b21 value";
    //    b.b2 = "b22 value";

    //    a = new aaa();
    //    rv.Add(a);
    //    a.a1 = "a2 value";
    //    a.b1 = new List<bbb>();
    //    b = new bbb();
    //    a.b1.Add(b);
    //    b.b1 = "b31 value";
    //    b.b2 = "b32 value";
    //    b = new bbb();
    //    a.b1.Add(b);
    //    b.b1 = "b41 value";
    //    b.b2 = "b42 value";

    //    return rv;
    //}

    [WebMethod]
    public string Order(Purchase purchase, List<PurchaseDetail> purchaseDetail,ref string ref1, out int out1)
    {
        //throw new Exception("AAABBBCCC");
        //System.Threading.Thread.Sleep(10000);
        ref1 = "ref1";
        out1 = 1;
        using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
        {
            using (IDbConnection cn = provider.OpenConnection())
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    return "PR-2019-" + (new Random()).Next(1000, 9999).ToString();
                }
            }
        }
    }

    [WebMethod]
    public void Order1(Purchase purchase, List<PurchaseDetail> purchaseDetail, ref string ref1)
    {
    }

    [WebMethod]
    public void Order2(Purchase purchase, List<PurchaseDetail> purchaseDetail, ref string ref1, out int out1)
    {
        out1 = 1;
    }

    [WebMethod]
    public void Order3(Purchase purchase, List<PurchaseDetail> purchaseDetail, ref string ref1, out int out1, out int out2)
    {
        out1 = 1;
        out2 = 2;
    }

    [WebMethod]
    public string[][] Test1()
    {
        string[][] arr = new string[3][];
        arr[0] = new string[] { "1" };
        arr[1] = new string[] { "1", "2" };
        arr[2] = new string[] { "1", "2", "3" };

        return arr;
    }
}

public class bbbcccddd : System.Web.Services.WebService
{
    public bbbcccddd()
    {

        //如果使用设计的组件，请取消注释以下行 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld21()
    {
        return "Hello World";
    }
}

public class Purchase
{
    public string Reason;
    public decimal Amount;
    public List<PurchaseDetail> PurchaseDetail;
}

public class PurchaseDetail
{
    public string ProdName;
    public decimal Price;
    public decimal Qty;
    public decimal Subtotal;
}

public class MySoapHeader : SoapHeader
{
    public MySoapHeader()
    {
        this.Actor = "aaabbbccc";
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }
    public string UserName;
    public string PassWord;
    public bool ValideUser(string in_UserName, string in_PassWord)
    {
        return true;
    }
}

public class MySoapHeader123 : SoapHeader
{
    public MySoapHeader123()
    {
        this.Actor = "aaabbbccc";
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }
    public string[] UserName;
    public string aaa;

}