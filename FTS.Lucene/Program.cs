using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FTS
{
    class Program
    {
        static void Main(string[] args)
        {
            PG.Luc l = new PG.Luc();
            //l.CreateIndex(ConfigurationManager.AppSettings["filesPath"].ToString());
            l.Search("點此連結至MyCMS[EF流程變更公佈欄");
            //new PG.FTSReader().ContentExcel("123");

            Console.WriteLine("任意鍵結束!!");
            Console.ReadKey();
        }
    }
}
