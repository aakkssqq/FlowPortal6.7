
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FTS
{
    class Program
    {
        static void Main(string[] args)
        {
            string filePath = ConfigurationManager.AppSettings["filesPath"].ToString();
            string indexPath = ConfigurationManager.AppSettings["indexPath"].ToString();



            PG.Luc l = new PG.Luc();
            //建立索引 於暫存資料表
            l.ReSetDocToIndex(filePath);
            Console.WriteLine($@"建立索引完成 檔案庫位置 : {ConfigurationManager.AppSettings["filesPath"].ToString()}");

            //l.Search("TEST",99);
            Console.WriteLine("任意鍵結束!!");
            Console.ReadKey();
        }
    }
}
