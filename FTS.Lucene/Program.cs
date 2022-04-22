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
            l.Search();


//            PanGu.HighLight.SimpleHTMLFormatter simpleHTMLFormatter = new PanGu.HighLight.SimpleHTMLFormatter("<font color=\"red\">", "</font>");
//            PanGu.HighLight.Highlighter highlighter = new PanGu.HighLight.Highlighter(simpleHTMLFormatter, new PanGu.Segment());
//            highlighter.FragmentSize = 100; // 设置每个摘要段的字符数
//            string keywords = "信号/道路/开通";
//            string content = @"高德完胜百度。我专门花了几个星期，在我所在的城市测试两个地图，高德数据不准确在少数，而百度就是家常便饭了，表现为：
//已经管制一年的道路（双向变单向），百度仍然提示双向皆可走。
//已经封闭数年的道路，百度仍然说是通的。
//新修道路，还没有开通，百度居然让走。
//有时候规划路线时明明是正确的，但是导航过程中，就出乱子，信号没问题、路线不复杂，明明是要左转，百度却叫右转。";
//            string abs = highlighter.GetBestFragment(keywords, content);
//            Console.WriteLine(abs);


            //PanGu.Segment.Init();
            //PanGu.Segment segment = new PanGu.Segment();
            //ICollection<PanGu.WordInfo> words = segment.DoSegment("山东落花生花落东山，长春市长春花店");
            //foreach (var word in words)
            //{
            //    Console.WriteLine(word.Word);
            //    Console.WriteLine(Environment.NewLine);
            //}
            //Console.ReadKey();
        }
    }
}
