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
using System.Text;
using BPM;
using BPM.Client;
using BPM.Client.Data.Common;
using System.Globalization;

/// <summary>
/// StringHelper 的摘要说明

/// </summary>
public class YZHex
{
    public static string EncodeHexString(byte[] sArray)
    {
        string str = null;
        if (sArray == null)
        {
            return str;
        }
        char[] chArray = new char[sArray.Length * 2];
        int index = 0;
        int num3 = 0;
        while (index < sArray.Length)
        {
            int num = (sArray[index] & 240) >> 4;
            chArray[num3++] = HexDigit(num);
            num = sArray[index] & 15;
            chArray[num3++] = HexDigit(num);
            index++;
        }
        return new string(chArray);
    }

    public static byte[] DecodeHexString(string hexString)
    {
        byte[] buffer;
        if (hexString == null)
        {
            throw new ArgumentNullException("hexString");
        }
        bool flag = false;
        int num = 0;
        int length = hexString.Length;
        if (((length >= 2) && (hexString[0] == '0')) && ((hexString[1] == 'x') || (hexString[1] == 'X')))
        {
            length = hexString.Length - 2;
            num = 2;
        }
        if (((length % 2) != 0) && ((length % 3) != 2))
        {
            throw new ArgumentException("Argument InvalidHexFormat");
        }
        if ((length >= 3) && (hexString[num + 2] == ' '))
        {
            flag = true;
            buffer = new byte[(length / 3) + 1];
        }
        else
        {
            buffer = new byte[length / 2];
        }
        for (int i = 0; num < hexString.Length; i++)
        {
            int num4 = ConvertHexDigit(hexString[num]);
            int num3 = ConvertHexDigit(hexString[num + 1]);
            buffer[i] = (byte)(num3 | (num4 << 4));
            if (flag)
            {
                num++;
            }
            num += 2;
        }
        return buffer;
    }

    private static char HexDigit(int num)
    {
        return ((num < 10) ? ((char)(num + 0x30)) : ((char)(num + 0x37)));
    }

    public static int ConvertHexDigit(char val)
    {
        if ((val <= '9') && (val >= '0'))
        {
            return (val - '0');
        }
        if ((val >= 'a') && (val <= 'f'))
        {
            return ((val - 'a') + 10);
        }
        if ((val < 'A') || (val > 'F'))
        {
            throw new ArgumentException("ArgumentOutOfRange Index");
        }
        return ((val - 'A') + 10);
    }
}
