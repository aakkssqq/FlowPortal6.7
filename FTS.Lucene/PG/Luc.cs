using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.IO;
using Lucene.Net.Store;
using Lucene.Net.Analysis.PanGu;
using PanGu;
using Lucene.Net.Documents;
using Lucene.Net.Search;
using Lucene.Net.QueryParsers;
using Lucene.Net.Index;
using System.Threading;
using Newtonsoft.Json.Linq;

namespace FTS.PG
{
    public class Luc
    {
        string IndexPath = ConfigurationManager.AppSettings["indexPath"];
        string FilePath = ConfigurationManager.AppSettings["filesPath"].ToString();

        public string CreateIndex(string folderPath)
        {
            Console.WriteLine($@"[CreateIndex] 開始建立索引");
            string msg = "";
            var dis = new DirectoryInfo(folderPath);

            using (new ImpersonateUser(ConfigurationManager.AppSettings["FilesPathLoginAcc"], "Domain", ConfigurationManager.AppSettings["FilesPathLoginPwd"]))
            {
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
                            && (fi.Extension.ToUpper() == ".DOCX" || fi.Extension.ToUpper() == ".DOC" || fi.Extension.ToUpper() == ".PDF" ||
                                fi.Extension.ToUpper() == ".MSG" || fi.Extension.ToUpper() == ".XLSX" || fi.Extension.ToUpper() == ".XLS" ||
                                fi.Extension.ToUpper() == ".PPTX" || fi.Extension.ToUpper() == ".PPT" || fi.Extension.ToUpper() == ".TXT" ||
                                fi.Extension.ToUpper() == ".CSV" || fi.Extension.ToUpper() == ".ASPX" || fi.Extension.ToUpper() == ".CS" ||
                                fi.Extension.ToUpper() == ".HTML" || fi.Extension.ToUpper() == ".HTM" || fi.Extension.ToUpper() == ".SQL" ||
                                fi.Extension.ToUpper() == ".XML" || fi.Extension.ToUpper() == ".CSS" || fi.Extension.ToUpper() == ".JS" ||
                                fi.Extension.ToUpper() == ".SLN" || fi.Extension.ToUpper() == ".CSPROJ" || fi.Extension.ToUpper() == ".H" ||
                                fi.Extension.ToUpper() == ".INI" || fi.Extension.ToUpper() == ".CONFIG" || fi.Extension.ToUpper() == ".RTF" ||
                                fi.Extension.ToUpper() == ".FX" || fi.Extension.ToUpper() == ".CONFIG" || fi.Extension.ToUpper() == ".RTF")
                           )
                        {
                            try
                            {
                                Console.WriteLine($@"[CreateIndex] {fi.FullName} 加入索引資料庫");
                                AddDocToIndex(fi);//加入索引資料庫 
                            }
                            catch (Exception ex)
                            {
                                msg += ex.Message;
                                //throw new Exception(ex.Message);
                            }
                        }
                    }
                }
                return msg;
            }
        }

        public void ReSetDocToIndex(string folderPath)
        {
            var _IndexPath = ConfigurationManager.AppSettings["IndexPath"].ToString();
            FSDirectory dir = FSDirectory.Open(new DirectoryInfo(_IndexPath));
            var indexWriter = new IndexWriter(dir, new PanGuAnalyzer(), IndexWriter.MaxFieldLength.LIMITED);
            indexWriter.DeleteAll();
            indexWriter.Optimize();
            indexWriter.Commit();
            indexWriter.Close();

            Console.WriteLine($@"[ReSetDocToIndex] 開始重建索引 索引資料夾位置 : {folderPath}");
            var re = CreateIndex(folderPath);
            if (!string.IsNullOrWhiteSpace(re))
            {
                Console.WriteLine($@"建立索引 產生錯誤 錯誤訊息 : {re}");
            }
        }

        public bool AddDocToIndex(FileInfo fi)
        {
            Console.WriteLine($@"[AddDocToIndex] 開啟檔案 檔案名稱 : {fi.Name}");
            FSDirectory dir = FSDirectory.Open(new DirectoryInfo(IndexPath));
            //使用標準分詞分析(字為單位)
            //Analyzer analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_22);
            //var indexWriter = new IndexWriter(dir, analyzer,IndexWriter.MaxFieldLength.UNLIMITED);

            //使用盤古分詞
            var indexWriter = new IndexWriter(dir, new PanGuAnalyzer(), IndexWriter.MaxFieldLength.LIMITED);

            //搜尋器
            //var searcher = new IndexSearcher(dir, true);

            Console.WriteLine($@"[AddDocToIndex] 建立索引 檔案名稱 : {fi.Name}");
            Document doc = new Document();
            try
            {
                // 把每一個欄位都建立索引
                Field fId = new Field("fId", Guid.NewGuid().ToString(), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
                Field title = new Field("title", fi.Name, Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
                Field path = new Field("path", fi.DirectoryName, Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
                Field content = new Field("content", new FTSReader().ReadContent(fi), Field.Store.YES, Field.Index.ANALYZED, Field.TermVector.NO);
                Field url = new Field("url", "", Field.Store.YES, Field.Index.NO);

                Console.WriteLine($@"[AddDocToIndex] 檔案名稱 : {fi.Name} 檔案內文 : {content}");

                doc.Add(fId);
                doc.Add(title);
                doc.Add(path);
                doc.Add(content);
                doc.Add(url);
                indexWriter.AddDocument(doc);
                Console.WriteLine($@"[AddDocToIndex] 檔案名稱 : {fi.Name} 建立索引完成");
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            finally
            {
                indexWriter.Optimize();
                indexWriter.Commit();
                indexWriter.Close();
            }
        }

        public dynamic Search(string keyWord, int count)
        {
            string res = "";
            int contentLength = Convert.ToInt32(ConfigurationManager.AppSettings["resultContentLength"]);
            DirectoryInfo directIndexPath = new DirectoryInfo(ConfigurationManager.AppSettings["indexPath"]);
            if (!directIndexPath.Exists)
                directIndexPath.Create();

            // 索引目录
            Lucene.Net.Store.Directory dir = FSDirectory.Open(directIndexPath);

            // 索引搜索器 將自動建立索引拆開
            IndexSearcher searcher;
            try
            {
                searcher = new IndexSearcher(dir, true);
                //searcher = new IndexSearcher(FSDirectory.Open(new DirectoryInfo(directIndexPath.FullName)), true);
            }
            catch (Exception e)
            {
                res = CreateIndex(FilePath);
                searcher = new IndexSearcher(dir, true);
            }



            // 查询器
            string q = GetKeyWordsSplitBySpace(keyWord, new PanGuTokenizer());
            // QueryParser qp = new QueryParser(Lucene.Net.Util.Version.LUCENE_29, "title", new PanGuAnalyzer(true));
            MultiFieldQueryParser qp = new MultiFieldQueryParser(Lucene.Net.Util.Version.LUCENE_29, new string[] { "title", "content" }, new PanGuAnalyzer(true));
            Query query = qp.Parse(q);

            var rv = new JObject();

            // 搜索
            TopDocs topDocs = searcher.Search(query, count); // 20 为最大返回条数
            rv["indexRes"] = res;
            rv["searchSec"] = topDocs.GetMaxScore();
            rv["total"] = topDocs.scoreDocs.Length;
            var children = new JArray();
            rv["children"] = children;

            //PanGu create highlighter
            PanGu.HighLight.SimpleHTMLFormatter simpleHTMLFormatter = new PanGu.HighLight.SimpleHTMLFormatter("<span style=\"font-weight:bold;color: red;\">", "</span>");
            PanGu.HighLight.Highlighter highlighter = new PanGu.HighLight.Highlighter(simpleHTMLFormatter, new Segment());
            highlighter.FragmentSize = contentLength;

            for (int i = 0; i < topDocs.scoreDocs.Length; i++)
            {

                Document doc = searcher.Doc(topDocs.scoreDocs[i].doc);
                var item = new JObject();
                children.Add(item);
                item["title"] = highlighter.GetBestFragment(keyWord, doc.GetField("title").StringValue()).Length == 0 ? doc.GetField("title").StringValue() : highlighter.GetBestFragment(keyWord, doc.GetField("title").StringValue());

                item["content"] = highlighter.GetBestFragment(keyWord, doc.GetField("content").StringValue().Trim()).Length == 0 ? doc.GetField("content").StringValue().Trim() : highlighter.GetBestFragment(keyWord, doc.GetField("content").StringValue().Trim());
                item["path"] = doc.GetField("path").StringValue();
                item["url"] = doc.GetField("url").StringValue();
            }
            // 關閉
            searcher.Close();
            dir.Close();
            return rv;
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
