using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace YZSoft.Web.Push
{
    public class ClientIDGenerator
    {
        private static readonly Regex _nonAlphanumericRegex = new Regex("[^a-zA-Z0-9]", RegexOptions.Compiled);
        private static readonly RNGCryptoServiceProvider _rngCryptoServiceProvider = new RNGCryptoServiceProvider();

        public static string GenerateClientID()
        {
            string clientID;
            do
            {
                byte[] bytes = new byte[15];
                _rngCryptoServiceProvider.GetBytes(bytes);
                clientID = _nonAlphanumericRegex.Replace(Convert.ToBase64String(bytes), "");
            }
            while (ClientManager.Instance.TryGetByID(clientID) != null);
            return clientID;
        }
    }
}