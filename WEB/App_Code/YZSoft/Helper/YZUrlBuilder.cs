using System;
using System.Web;
using System.Collections.Generic;

public class YZUrlBuilder : UriBuilder
{
    private bool _pathFlag = false;
    private string _pathBody = null;
    private Dictionary<string,string> _queryString = null;

    #region Properties

    public Dictionary<string,string> QueryString
    {
        get
        {
            if (_queryString == null)
            {
                _queryString = new Dictionary<string,string>();
            }

            return _queryString;
        }
    }

    public new string Query
    {
        get
        {
            this.GetQueryString();
            return base.Query;
        }
    }

    #endregion

    #region Constructor overloads

    public YZUrlBuilder()
        : base()
    {
    }

    public static YZUrlBuilder FromPath(string path)
    {
        string urlBody;
        string urlQuery;

        int index = path.IndexOf('?');
        if (index != -1)
        {
            urlBody = path.Substring(0, index);
            urlQuery = path.Substring(index);
        }
        else
        {
            urlBody = path;
            urlQuery = String.Empty;
        }

        YZUrlBuilder urlBuilder = new YZUrlBuilder("a.aspx" + urlQuery);
        urlBuilder._pathFlag = true;
        urlBuilder._pathBody = urlBody;

        return urlBuilder;
    }

    public YZUrlBuilder(string uri)
        : base(uri)
    {
        PopulateQueryString();
    }

    #endregion

    #region Public methods

    public new string ToString()
    {
        GetQueryString();

        if (this._pathFlag)
        {
            return this._pathBody + base.Uri.Query;
        }
        else
        {
            return base.Uri.AbsoluteUri;
        }
    }

    #endregion

    #region Private methods

    private void PopulateQueryString()
    {
        string query = base.Query;

        if (query == string.Empty || query == null)
        {
            return;
        }

        if (_queryString == null)
        {
            _queryString = new Dictionary<string,string>();
        }

        _queryString.Clear();

        query = query.Substring(1); //remove the ?

        string[] pairs = query.Split(new char[] { '&' });
        foreach (string s in pairs)
        {
            string[] pair = s.Split(new char[] { '=' });

            _queryString[pair[0]] = (pair.Length > 1) ? pair[1] : string.Empty;
        }
    }

    private void GetQueryString()
    {
        if (this._queryString == null || this._queryString.Count == 0)
        {
            base.Query = string.Empty;
            return;
        }

        int count = _queryString.Count;
        string[] keys = new string[count];
        string[] values = new string[count];
        string[] pairs = new string[count];

        _queryString.Keys.CopyTo(keys, 0);
        _queryString.Values.CopyTo(values, 0);

        int i = 0;
        int j;
        for (j = 0; j < count; j++)
        {
            string value = values[j];
            if (value != null)
                value = value.Trim();

            if (String.IsNullOrEmpty(value))
            {
                pairs[i] = keys[j];
            }
            else
            {
                value = HttpUtility.UrlEncode(value);
                value = value.Replace("+", "%20");  //HttpUtility.UrlEncode存在一个BUG,会将空格，转化为"+"号，而不是%20( 如果原来是 "+" 则被转换成 "%2b" ) 

                pairs[i] = string.Concat(keys[j], "=", value);
            }
            i++;
        }

        base.Query = string.Join("&", pairs, 0, i);
    }

    #endregion
}
