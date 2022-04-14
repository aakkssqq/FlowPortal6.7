using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.Text;
using Newtonsoft.Json.Linq;

/// <summary>
///YZReader 的摘要说明


/// </summary>
public class YZReader : IDisposable
{
    private IDataReader _reader = null;
    private bool _readTotalRow = false;
    private string _totalRowColumnName = "TotalRows";
    private int _totalRows = -1;
    private int _startRowIndex = 1;

    public YZReader(IDataReader reader)
        : this(reader, false, 1)
    {
    }

    public YZReader(IDataReader reader, bool readTotalRow, int startRowIndex)
    {
        this._reader = reader;
        this._readTotalRow = readTotalRow;
        this._startRowIndex = startRowIndex;
    }

    public YZReader(IDataReader reader, bool readTotalRow, int startRowIndex, string totalRowColumnName)
    {
        this._reader = reader;
        this._readTotalRow = readTotalRow;
        this._startRowIndex = startRowIndex;
        this._totalRowColumnName = totalRowColumnName;
    }

    public IDataReader IDataReader
    {
        get
        {
            return this._reader;
        }
    }

    public int TotalRows
    {
        get
        {
            return this._totalRows < 0 ? 0 : this._totalRows;
        }
    }

    public DataTable LoadTable() {
        int totalrows;
        DataTable table = new DataTable("Result");
        LoadTable(table, 0, -1, out totalrows);
        return table;
    }

    public void LoadTable(DataTable table)
    {
        int totalrows;
        LoadTable(table, 0, -1, out totalrows);
    }

    public void LoadTable(DataTable table, int startRowIndex, int rows, out int totalrows)
    {
        int fieldCount = this.IDataReader.FieldCount;
        for (int i = 0; i < fieldCount; i++)
        {
            table.Columns.Add(this.IDataReader.GetName(i), this.IDataReader.GetFieldType(i));
        }

        //Skip rows
        int perfixRows = 0;
        while (perfixRows < startRowIndex)
        {
            if (!this.Read())
            {
                break;
            }
            perfixRows++;
        }

        //读取数据
        if (rows == -1)
        {
            while (this.Read())
            {
                DataRow row = table.NewRow();
                table.Rows.Add(row);
                for (int j = 0; j < this.IDataReader.FieldCount; j++)
                {
                    object value = YZReader.GetValue(this.IDataReader, j);
                    row[j] = value;
                }
            }
        }
        else
        {
            for (int k = 0; k < rows; k++)
            {
                if (!this.Read())
                {
                    break;
                }
                DataRow row = table.NewRow();
                table.Rows.Add(row);
                for (int m = 0; m < this.IDataReader.FieldCount; m++)
                {
                    object value = YZReader.GetValue(this.IDataReader, m);
                    row[m] = value;
                }
            }
        }

        //后面的行数
        int postRows = 0;
        while (this.Read())
        {
            postRows++;
        }
        totalrows = (perfixRows + table.Rows.Count) + postRows;
    }

    public static object GetValue(IDataReader reader, int index)
    {
        object value;

        try
        {
            value = reader.GetValue(index);

            //SQL Server数据库中monery4位小数点处理
            if (value is decimal && reader is System.Data.SqlClient.SqlDataReader)
                value = (decimal)Decimal.ToDouble((decimal)value);
        }
        catch (Exception e)
        {
            Type readerType = reader.GetType();
            System.Reflection.MethodInfo method = readerType.GetMethod("GetOracleValue", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public);
            if (method == null)
                throw e;

            value = method.Invoke(reader, new object[] { index });
            string s = value.ToString();
            value = Decimal.Parse(s);
        }

        return value;
    }

    public bool Read()
    {
        bool rv = this._reader.Read();
        if (this._readTotalRow && this._totalRows == -1)
        {
            if (!rv)
            {
                this._totalRows = 0;
            }
            else
            {
                this._totalRows = this.ReadInt32(this._totalRowColumnName);
                if (this._startRowIndex > 1)
                    rv = this._reader.Read();
                //if (this._startRowIndex > 0)
                //    rv = this._reader.Read();
            }
        }
        return rv;
    }

    public bool IsDBNull(int index)
    {
        return this._reader.IsDBNull(index);
    }

    public bool IsDBNull(string fieldName)
    {
        return IsDBNull(this._reader.GetOrdinal(fieldName));
    }

    public DateTime ReadDateTime(int index)
    {
        if (this._reader.IsDBNull(index))
            return DateTime.MinValue;

        return this._reader.GetDateTime(index);
    }

    public DateTime ReadDateTime(string fieldName)
    {
        return ReadDateTime(this._reader.GetOrdinal(fieldName));
    }

    public int ReadInt32(int index)
    {
        if (this._reader.IsDBNull(index))
            return -1;

        return Convert.ToInt32(this._reader.GetValue(index));
    }

    public int ReadInt32(string fieldName)
    {
        return ReadInt32(this._reader.GetOrdinal(fieldName));
    }

    public decimal ReadDecimal(int index)
    {
        if (this._reader.IsDBNull(index))
            return 0;

        //SQL Server数据库中monery4位小数点处理
        return (decimal)Convert.ToDouble(this._reader.GetValue(index));
    }

    public decimal ReadDecimal(string fieldName)
    {
        return ReadDecimal(this._reader.GetOrdinal(fieldName));
    }

    public float ReadFloat(int index)
    {
        if (this._reader.IsDBNull(index))
            return 0;

        return (float)Convert.ToDouble(this._reader.GetValue(index));
    }

    public float ReadFloat(string fieldName)
    {
        return ReadFloat(this._reader.GetOrdinal(fieldName));
    }

    public uint ReadUInt32(int index, uint defaultValue)
    {
        if (this._reader.IsDBNull(index))
            return defaultValue;

        int value = Convert.ToInt32(this._reader.GetValue(index));
        if (value < 0)
            return defaultValue;

        return (uint)value;
    }

    public uint ReadUInt32(string fieldName, uint defaultValue)
    {
        return ReadUInt32(this._reader.GetOrdinal(fieldName), defaultValue);
    }

    public bool ReadBool(int index, bool defaultValue)
    {
        object objValue = this._reader.GetValue(index);
        if (System.Convert.IsDBNull(objValue))
            return defaultValue;

        if (objValue is bool)
            return (bool)objValue;

        int value = System.Convert.ToInt32(objValue);
        if (value == 0)
            return false;
        else
            return true;
    }

    public bool ReadBool(string fieldName, bool defaultValue)
    {
        return ReadBool(this._reader.GetOrdinal(fieldName), defaultValue);
    }

    public string ReadString(int index)
    {
        object objValue = this._reader.GetValue(index);

        if (System.Convert.IsDBNull(objValue))
            return null;

        if (objValue is string)
            return (string)objValue;

        try
        {
            if (objValue is byte[])
                return Encoding.UTF8.GetString((byte[])objValue);
        }
        catch
        {
        }

        return null;
    }

    public string ReadString(string fieldName)
    {
        return ReadString(this._reader.GetOrdinal(fieldName));
    }

    public T ReadJToken<T>(int index, T defaultValue) where T : JToken
    {
        string sValue = this.ReadString(index);
        if (String.IsNullOrEmpty(sValue))
            return defaultValue;

        T rv = (T)JToken.Parse(sValue);
        return rv;
    }

    public T ReadJToken<T>(string fieldName, T defaultValue) where T : JToken
    {
        return ReadJToken<T>(this._reader.GetOrdinal(fieldName), defaultValue);
    }

    public T ReadJToken<T>(string fieldName) where T : JToken
    {
        return ReadJToken<T>(this._reader.GetOrdinal(fieldName), null);
    }

    public Version ReadVersion(int index, Version defaultValue)
    {
        object objValue = this._reader.GetValue(index);

        if (System.Convert.IsDBNull(objValue))
            return null;

        if (objValue is string)
        {
            try
            {
                return new Version(objValue as string);
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }

        return defaultValue;
    }

    public Version ReadVersion(string fieldName, Version defaultValue)
    {
        return ReadVersion(this._reader.GetOrdinal(fieldName), defaultValue);
    }

    public Guid ReadGuid(int index)
    {
        object objValue = this._reader.GetValue(index);

        if (System.Convert.IsDBNull(objValue))
            return Guid.Empty;

        if (objValue is Guid)
            return (Guid)objValue;

        try
        {
            if (objValue is string)
                return new Guid(objValue as string);
        }
        catch
        {
        }
        return Guid.Empty;
    }

    public Guid ReadGuid(string fieldName)
    {
        return ReadGuid(this._reader.GetOrdinal(fieldName));
    }

    public object ReadObject(int index, object defvalue)
    {
        object value = this._reader.GetValue(index);
        if (System.Convert.IsDBNull(value))
            return defvalue;
        else
        {
            string strValue = value as string;
            if (strValue != null)
            {
                strValue = strValue.Trim();
                return strValue;
            }

            return value;
        }
    }

    public object ReadObject(string fieldName, object defvalue)
    {
        return ReadObject(this._reader.GetOrdinal(fieldName), defvalue);
    }

    public T ReadEnum<T>(int index, T defaultValue) where T : struct
    {
        string value = ReadString(index);

        if (!String.IsNullOrEmpty(value))
            value = value.Trim();

        if (String.IsNullOrEmpty(value))
            return defaultValue;

        T rv;
        if (!Enum.TryParse<T>(value, true, out rv))
            rv = defaultValue;

        return rv;
    }

    public T ReadEnum<T>(string fieldName, T defaultValue) where T : struct
    {
        return ReadEnum<T>(this._reader.GetOrdinal(fieldName), defaultValue);
    }

    public object ReadEnum(int index, Type enumType, object defaultValue)
    {
        string value = ReadString(index);

        if (!String.IsNullOrEmpty(value))
            value = value.Trim();

        if (String.IsNullOrEmpty(value))
            return defaultValue;

        try
        {
            return Enum.Parse(enumType, value, true);
        }
        catch
        {
            return defaultValue;
        }
    }

    public object ReadEnum(string fieldName, Type enumType, object defaultValue)
    {
        return ReadEnum(this._reader.GetOrdinal(fieldName), enumType, defaultValue);
    }

    public static DateTime ReadDateTime(IDataReader reader, int index)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadDateTime(index);
    }

    public static DateTime ReadDateTime(IDataReader reader, string fieldName)
    {
        return ReadDateTime(reader, reader.GetOrdinal(fieldName));
    }

    public static int ReadInt32(IDataReader reader, int index)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadInt32(index);
    }

    public static int ReadInt32(IDataReader reader, string fieldName)
    {
        return ReadInt32(reader, reader.GetOrdinal(fieldName));
    }

    public static bool ReadBool(IDataReader reader, int index, bool defaultValue)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadBool(index, defaultValue);
    }

    public static bool ReadBool(IDataReader reader, string fieldName, bool defaultValue)
    {
        return ReadBool(reader, reader.GetOrdinal(fieldName), defaultValue);
    }

    public static string ReadString(IDataReader reader, int index)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadString(index);
    }

    public static string ReadString(IDataReader reader, string fieldName)
    {
        return ReadString(reader, reader.GetOrdinal(fieldName));
    }

    public static Guid ReadGuid(IDataReader reader, int index)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadGuid(index);
    }

    public static Guid ReadGuid(IDataReader reader, string fieldName)
    {
        return ReadGuid(reader, reader.GetOrdinal(fieldName));
    }

    public static object ReadObject(IDataReader reader, int index, object defaultValue)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadObject(index, defaultValue);
    }

    public static object ReadObject(IDataReader reader, string fieldName, object defaultValue)
    {
        return ReadObject(reader, reader.GetOrdinal(fieldName), defaultValue);
    }

    public static object ReadEnum(IDataReader reader, int index, Type enumType, object defaultValue)
    {
        YZReader dbr = new YZReader(reader);
        return dbr.ReadEnum(index, enumType, defaultValue);
    }

    public static object ReadEnum(IDataReader reader, string fieldName, Type enumType, object defaultValue)
    {
        return ReadEnum(reader, reader.GetOrdinal(fieldName), enumType, defaultValue);
    }

    #region IDisposable 成员

    public void Dispose()
    {
        if (this._reader != null)
            this._reader.Dispose();
    }

    #endregion
}
