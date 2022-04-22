using System;
using Lucene;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using Lucene.Net.Store;
using Lucene.Net.Analysis.PanGu;
using PanGu;
using Lucene.Net.Documents;
using Lucene.Net.Search;
using Lucene.Net.QueryParsers;
using Lucene.Net.Index;
using System.Threading;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;

namespace FTS.PG
{
    class Luc
    {
        string IndexPath = ConfigurationManager.AppSettings["indexPath"];
        string FilePath = ConfigurationManager.AppSettings["filesPath"].ToString();

        public void CreateIndex(string folderPath)
        {
            //檔案來源
            var _SourceFilePath = folderPath;
            //索引資料庫路徑
            var _IndexPath = ConfigurationManager.AppSettings["IndexPath"].ToString();
            var dis = new DirectoryInfo(_SourceFilePath);
            var filterdis = dis.GetDirectories()
              .Where(x => ((!x.Attributes.HasFlag(FileAttributes.System)
                   || !x.Attributes.HasFlag(FileAttributes.Hidden))
                   && x.Name != "LuceneIndexData"
                   && x.Name != "OpenfindIndex"
                   && x.Name != "DevTools"
                   && x.Name != "software"
                   && x.Name != "sqltmp"
                   && x.Name != "sqldatafile"
                   && x.Name != "sqlbk"
                   )).ToList<DirectoryInfo>();
            filterdis.Add(dis);//準備處理的檔案項目

            int i = 1;
            //檔案類型過濾
            foreach (DirectoryInfo di in filterdis)
            {
                foreach (FileInfo fi in di.GetFiles("*.*", SearchOption.AllDirectories))
                {
                    Thread.Sleep(100);
                    string curentFname = fi.FullName;
                    if ((!fi.Attributes.HasFlag(FileAttributes.Hidden) || !fi.Attributes.HasFlag(FileAttributes.System))
                        && (fi.Extension.ToUpper() == ".DOCX" || fi.Extension.ToUpper() == ".DOC"
                        || fi.Extension.ToUpper() == ".PDF" || fi.Extension.ToUpper() == ".MSG"
                        || fi.Extension.ToUpper() == ".XLSX" || fi.Extension.ToUpper() == ".XLS"
                        || fi.Extension.ToUpper() == ".PPTX" || fi.Extension.ToUpper() == ".PPT"
                        || fi.Extension.ToUpper() == ".TXT")
                        )
                    {
                        AddDocToIndex(fi);//加入索引資料庫 
                    }
                }
            }
        }
        public bool AddDocToIndex(FileInfo fi)
        {
            var _IndexPath = ConfigurationManager.AppSettings["IndexPath"].ToString();
            FSDirectory dir = FSDirectory.Open(new DirectoryInfo(_IndexPath));
            //使用標準分詞分析(字為單位)
            Analyzer analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_22);

            //var indexWriter = new IndexWriter(dir, analyzer,IndexWriter.MaxFieldLength.UNLIMITED);
            var indexWriter = new IndexWriter(dir, new PanGuAnalyzer(), IndexWriter.MaxFieldLength.LIMITED);
            var searcher = new IndexSearcher(dir, true);
            Document doc = new Document();
            // 把每一個欄位都建立索引
            Field fId = new Field("fId", Guid.NewGuid().ToString(), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
            Field title = new Field("title", fi.Name, Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
            Field path = new Field("path", fi.DirectoryName, Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
            Field content = new Field("content", new FTSReader().ReadContent(fi) , Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
            Field url = new Field("url", "http://www.itpow.com/2", Field.Store.YES, Field.Index.NO);

            doc.Add(fId);
            doc.Add(title);
            doc.Add(path);
            doc.Add(content);
            doc.Add(url);
            indexWriter.AddDocument(doc);

            indexWriter.Optimize();
            indexWriter.Commit();
            indexWriter.Close();
            return true;
        }

        public void Search(string keyWord)
        {
            int contentLength = Convert.ToInt32(ConfigurationManager.AppSettings["resultContentLength"]);
            DirectoryInfo directIndexPath = new DirectoryInfo(ConfigurationManager.AppSettings["indexPath"]);
            if (!directIndexPath.Exists)
                directIndexPath.Create();

            // 索引目录
            Lucene.Net.Store.Directory dir = FSDirectory.Open(directIndexPath);

            // 索引搜索器
            IndexSearcher searcher = new IndexSearcher(dir, true);
            //IndexSearcher searcher = new IndexSearcher(FSDirectory.Open(new DirectoryInfo(directIndexPath.FullName)), true);

            // 查询器
            string q = GetKeyWordsSplitBySpace(keyWord, new PanGuTokenizer());
            // QueryParser qp = new QueryParser(Lucene.Net.Util.Version.LUCENE_29, "title", new PanGuAnalyzer(true));
            MultiFieldQueryParser qp = new MultiFieldQueryParser(Lucene.Net.Util.Version.LUCENE_29, new string[] { "title", "content" }, new PanGuAnalyzer(true));
            Query query = qp.Parse(q);

            // 搜索
            TopDocs topDocs = searcher.Search(query, 20); // 20 为最大返回条数
            for (int i = 0; i < topDocs.scoreDocs.Length; i++)
            {
                Document doc = searcher.Doc(topDocs.scoreDocs[i].doc);
                string title = doc.GetField("title").StringValue();
                string content = doc.GetField("content").StringValue().Trim();
                string path = doc.GetField("path").StringValue();
                string url = doc.GetField("url").StringValue();
                
                int sIndex = content.ToLower().IndexOf(keyWord.ToLower());
                string sContent = content.Substring(sIndex >= (contentLength / 2)? sIndex- (contentLength / 2):0 , contentLength);

                Console.WriteLine("文件名稱 : ["+title+ "]\r\n路徑 : " + path + "\r\n關鍵字 : "+ keyWord + "\r\n內容 : " + sContent + "\r\n連接網址 : ==" + url + "==\r\n" + topDocs.scoreDocs[i].score);
                Console.ReadLine();
            }
            // 關閉
            searcher.Close();
            dir.Close();
        }

        /**
	 * 初始化读索引组建
	 */
        private string GetKeyWordsSplitBySpace(string keywords, PanGuTokenizer ktTokenizer)
        {
            StringBuilder result = new StringBuilder();
            ICollection<WordInfo> words = ktTokenizer.SegmentToWordInfos(keywords);
            foreach (WordInfo word in words)
            {
                if (word == null)
                {
                    continue;
                }
                result.AppendFormat("{0}^{1}.0 ", word.Word, (int)Math.Pow(3, word.Rank));
            }
            return result.ToString().Trim();
        }
    }
}
