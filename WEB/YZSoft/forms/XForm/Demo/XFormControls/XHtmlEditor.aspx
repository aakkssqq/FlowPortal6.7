<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">

    // Insert page code here
    //

</script>
<html xmlns:xform="xmlns:xform">
<head id="Head1" runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>BPM Form</title>
    <style>
    BODY {FONT-SIZE: 12px; FONT-FAMILY: verdana}
    TABLE {border-collapse: collapse; FONT-SIZE: 12px; FONT-FAMILY: verdana}
    P {PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px; FONT-SIZE: 12px; FONT-FAMILY: verdana}
    TD {padding:1px}
    TD.NoPadding {PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; PADDING-TOP: 0px}
    /*INPUT {height: 15px}*/

    INPUT.UL {BORDER-RIGHT: medium none; BORDER-TOP: medium none; BORDER-LEFT: medium none; BORDER-BOTTOM: #33ff33 1px solid}
    TEXTAREA {FONT-SIZE:12px}

    input {vertical-align:middle;/*margin-right:-3px*/}
    </style>
    <script type='text/javascript'>
    </script>
</head>
<body>
    <form id="Form1" runat="server">
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td height="53" valign="middle" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <strong><font size="4">HtmlEditor</font></strong>
                        <br />
                        <font size="1">xclass:YZSoft.Forms.Field.HtmlEditor</font> 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Amount</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox2" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="Purchase.Amount" width="100%"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel5" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="富文本编辑" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td width="124" style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        HtmlEditor</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XHtmlEditor id="XHtmlEditor1" runat="server" XDataBind="var1" width="100%" height="200px" Express="source1"></aspxform:XHtmlEditor>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Source</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox1" runat="server" BorderWidth="1" BorderColor="#DCDCDC" width="100%" Express="var1" Rows="6" TextMode="MultiLine"></aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" colspan="2">
                        <aspxform:XLabel id="XLabel1" runat="server" BorderWidth="3px" BorderColor="Turquoise" Height="40px" BorderStyle="Solid" BackColor="#C0FFFF" Width="100%" TextAlign="Center" text="Disable/Hide" ForeColor="Black" Font-Bold="True" Font-Size="12px"></aspxform:XLabel>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Disable<br />
                        Amount==1<br />
                        Hide<br />
                        Amount==12 
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XHtmlEditor id="XHtmlEditor2" runat="server" width="100%" height="150px" Express="var1" DisableExpress="Purchase.Amount==1" HiddenExpress="Purchase.Amount==12"></aspxform:XHtmlEditor>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        Source1</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox7" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="source1" width="100%">&lt;div class=&quot;KJfzmo&quot; style=&quot;width: 540px; overflow: hidden; color: rgb(51, 51, 51); font-family: arial; font-size: medium;&quot;&gt;&lt;h3 class=&quot;t _jftlY wtyJUp&quot; style=&quot;margin: 0px 0px 1px; padding: 0px; list-style: none; font-weight: normal; font-size: medium; white-space: nowrap; overflow: hidden;&quot;&gt;&lt;a href=&quot;http://www.baidu.com/baidu.php?url=a000000f3uok7JOUHS9qUazwhsV7wH_CcwZHwJvtjRKr-RfU4bIiQLLrZLzJDErbrkEoGvo69ZVMOwhNKSL8U7p8cSqKW_AjHwFbsqaAY7aiwyxXBg_kDIG_J5_sMdJ-MbftcVn.DD_jgwIsmLHRAp272s1f_unMW8R.U1Yz0ZDqf-KP0ZfqmMKV0A-V5HczPfKM5yF-TZns0ZNG5yF9pywd0ZKGujYz0APGujYYnj60UgfqnW01rNtknjDL0AVG5H00TMfqnW0k0ANGujYkPWTkPdtkPjmdg1DYPW0zg1DzPWRLg1DYPjc4g1DsnWD1g1DzrjmLg1DvPHcsg1Dvn1cdg1DvPWm1g1DvPjcvg1DvPHDdg1Ddrjnkg1DkrH64g1D1rHnzg1DvP1ck0AFG5HcsP7tkPHR0UynqnNtdrHmdPjDsPfKkTA-b5H00TyPGujYs0ZFMIA7M5H00ULu_5HDsPHbVuZGxnHD3PzYkg1DkrHDVnNtknWcVuZGxnHcdradbX-tknWR4Qywlg1D1rjmVuZGxnHfYPzYkg1DYP1fVuZGxnHf4radbX-tLnHmVnNtLP1TVnfK9mWYsg100ugFM5H00TZ0qn0K8IM0qna3snj0snj0sn0KVIZ0qn0KbuAqs5H00ThCqn0KbugmqTAn0uMfqn0KspjYs0Aq15H00mMTqnH00UMfqn0K1XWY0IZN15HnzPjRvPWR1PjnsPHfLn1fknHc0ThNkIjYkPjn3rHcznWnzrjmY0ZPGujdBn1PWmhRdPj0snjFWm1fz0AP1UHdjrjm3nRnkrDc3PRP7PHn40A7W5HD0mhsqn0KWThnqPjfdrjT&amp;amp;us=0.0.0.0.0.0.1&quot; class=&quot;TQgbiv &quot; target=&quot;_blank&quot; data-is-main-url=&quot;true&quot; style=&quot;zoom: 1;&quot;&gt;FlowPortal&amp;nbsp;&lt;font color=&quot;#CC0000&quot;&gt;bpm&lt;/font&gt;，中国顶级&lt;font color=&quot;#CC0000&quot;&gt;bpm&lt;/font&gt;平台&lt;/a&gt;&lt;/h3&gt;&lt;/div&gt;&lt;div class=&quot;_bEjiL MSKtQW &quot; style=&quot;line-height: 20px; font-size: small; margin-top: 2px; color: rgb(51, 51, 51); font-family: arial;&quot;&gt;&lt;div class=&quot;ElzYSV&quot; style=&quot;margin: 2px 0px 0px; overflow: hidden; white-space: nowrap; word-wrap: normal;&quot;&gt;&lt;span style=&quot;margin-right: 18px;&quot;&gt;热点:&amp;nbsp;&lt;font color=&quot;#CC0000&quot;&gt;bpm&lt;/font&gt;&amp;nbsp;平台&lt;/span&gt;&lt;span style=&quot;margin-right: 18px;&quot;&gt;优势: 卓越品质 | 追求卓越 | 高效率&lt;/span&gt;&lt;/div&gt;众多世界500强企业的选择，全Web化云&lt;font color=&quot;#CC0000&quot;&gt;BPM&lt;/font&gt;架构，敏捷，高效，极致的&lt;font color=&quot;#CC0000&quot;&gt;bpm&lt;/font&gt;落地平台。企业业务流程管理的战略支撑平台。&lt;/div&gt;&lt;div class=&quot;tCdRAx MSKtQW&quot; style=&quot;margin-top: 1px; line-height: 15px; white-space: nowrap; word-wrap: normal; overflow: hidden; font-size: small; color: rgb(51, 51, 51); font-family: arial;&quot;&gt;&lt;span class=&quot;k_SdtT&quot; style=&quot;color: green; margin: 0px 5px 0px 0px;&quot;&gt;www.flowportal.com&lt;/span&gt;&amp;nbsp;&lt;span class=&quot;nlCYpb&quot; style=&quot;color: green;&quot;&gt;2015-08&lt;/span&gt;&lt;div id=&quot;tools_3002&quot; class=&quot;c-tools&quot; data-tools=&quot;{&amp;quot;title&amp;quot;:&amp;quot;FlowPortal bpm，中国顶级bpm平台&amp;quot;,&amp;quot;url&amp;quot;:&amp;quot;http://www.baidu.com/baidu.php?url=a000000f3uok7JOUHS9qUazwhsV7wH_CcwZHwJvtjRKr-RfU4bIiQLLrZLzJDErbrkEoGvo69ZVMOwhNKSL8U7p8cSqKW_AjHwFbsqaAY7aiwyxXBg_kDIG_J5_sMdJ-MbftcVn.DD_jgwIsmLHRAp272s1f_unMW8R.U1Yz0ZDqf-KP0ZfqmMKV0A-V5HczPfKM5yF-TZns0ZNG5yF9pywd0ZKGujYz0APGujYYnj60UgfqnW01rNtknjDL0AVG5H00TMfqnW0k0ANGujYkPWTkPdtkPjmdg1DYPW0zg1DzPWRLg1DYPjc4g1DsnWD1g1DzrjmLg1DvPHcsg1Dvn1cdg1DvPWm1g1DvPjcvg1DvPHDdg1Ddrjnkg1DkrH64g1D1rHnzg1DvP1ck0AFG5HcsP7tkPHR0UynqnNtdrHmdPjDsPfKkTA-b5H00TyPGujYs0ZFMIA7M5H00ULu_5HDsPHbVuZGxnHD3PzYkg1DkrHDVnNtknWcVuZGxnHcdradbX-tknWR4Qywlg1D1rjmVuZGxnHfYPzYkg1DYP1fVuZGxnHf4radbX-tLnHmVnNtLP1TVnfK9mWYsg100ugFM5H00TZ0qn0K8IM0qna3snj0snj0sn0KVIZ0qn0KbuAqs5H00ThCqn0KbugmqTAn0uMfqn0KspjYs0Aq15H00mMTqnH00UMfqn0K1XWY0IZN15HnzPjRvPWR1PjnsPHfLn1fknHc0ThNkIjYkPjn3rHcznWnzrjmY0ZPGujdBn1PWmhRdPj0snjFWm1fz0AP1UHdjrjm3nRnkrDc3PRP7PHn40A7W5HD0mhsqn0KWThnqPjfdrjT&amp;amp;us=0.0.0.0.0.0.1&amp;quot;}&quot; style=&quot;display: inline; margin-left: 5px;&quot;&gt;&lt;a class=&quot;c-tip-icon&quot;&gt;&lt;span class=&quot;c-icon c-icon-triangle-down-g&quot; style=&quot;display: inline-block; width: 14px; height: 14px; vertical-align: text-bottom; overflow: hidden; cursor: pointer; background: url(https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/icons_45de3f02.png) -744px -144px no-repeat;&quot;&gt;&lt;/span&gt;&lt;/a&gt;&lt;/div&gt;&lt;span class=&quot;icons wtyJUp&quot; style=&quot;display: inline-block; line-height: 12px; margin: 0px 5px 0px 3px;&quot;&gt;&lt;a href=&quot;http://www.baidu.com/s?wd=www.flowportal.com@v&amp;amp;vmp_ec=1437041498&amp;amp;vmp_ectm=70265e208d0d5ff20cd6fdfTE55zITbmd53c25Nac4=8Udk3NXl8N27Xcal6e6d6a3889ad8&amp;amp;from=fc&amp;amp;dataTime=62&quot; target=&quot;_blank&quot; data-click=&quot;{&amp;quot;rsv_mt&amp;quot;:&amp;quot;1017&amp;quot;,&amp;quot;rsv_vlevel&amp;quot;:&amp;quot;1&amp;quot;}&quot; class=&quot;c-icon icon-certify c-icon-v1 c-icon-v efc-cert&quot; data-renzheng=&quot;{title:&#39;上海易正信息技术有限公司：&#39;,identity: {a: {fm: &#39;pp&#39;,rsv_mt: &#39;1017&#39;,rsv_vlevel: &#39;1&#39;,rsv_vmenu: 1,p1:&#39;3002&#39;,url: &#39;http://www.baidu.com/s?wd=www.flowportal.com@v&amp;amp;vmp_ec=1437041498&amp;amp;vmp_ectm=70265e208d0d5ff20cd6fdfTE55zITbmd53c25Nac4=8Udk3NXl8N27Xcal6e6d6a3889ad8&amp;amp;from=fc&amp;amp;dataTime=62&#39;},img: &#39;&#39;,text: &#39;&#39;,credit: &#39;5&#39;,process: &#39;24&#39;,process_level: &#39;1&#39;}}&quot; style=&quot;display: inline-block; width: 19px; height: 14px; vertical-align: text-bottom; overflow: hidden; border: 1px solid transparent; cursor: pointer; text-decoration: none; background: url(https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/icons_45de3f02.png) -888px -192px no-repeat;&quot;&gt;&lt;/a&gt;&lt;/span&gt;&lt;font class=&quot;rkbLiE&quot; size=&quot;-1&quot; style=&quot;color: rgb(136, 136, 136) !important; display: inline-block;&quot;&gt;-&amp;nbsp;&lt;a href=&quot;http://e.baidu.com/?id=1&quot; target=&quot;_blank&quot; class=&quot;m&quot; style=&quot;color: rgb(102, 102, 102); text-decoration: none !important;&quot;&gt;推广&lt;/a&gt;&lt;/font&gt;&lt;font class=&quot;rkbLiE&quot; size=&quot;-1&quot; style=&quot;color: rgb(136, 136, 136) !important; display: inline-block;&quot;&gt;&amp;nbsp;-&amp;nbsp;&lt;a href=&quot;http://www.baidu.com/tools?url=http%3A%2F%2Fwww.baidu.com%2Fbaidu.php%3Furl%3Da000000f3uok7JOUHS9qUazwhsV7wH_CcwZHwJvtjRKr-RfU4bIiQLLrZLzJDErbrkEoGvo69ZVMOwhNKSL8U7p8cSqKW_AjHwFbsqaAY7aiwyxXBg_kDIG_J5_sMdJ-MbftcVn.DD_jgwIsmLHRAp272s1f_unMW8R.U1Yz0ZDqf-KP0ZfqmMKV0A-V5HczPfKM5yF-TZns0ZNG5yF9pywd0ZKGujYz0APGujYYnj60UgfqnW01rNtknjDL0AVG5H00TMfqnW0k0ANGujYkPWTkPdtkPjmdg1DYPW0zg1DzPWRLg1DYPjc4g1DsnWD1g1DzrjmLg1DvPHcsg1Dvn1cdg1DvPWm1g1DvPjcvg1DvPHDdg1Ddrjnkg1DkrH64g1D1rHnzg1DvP1ck0AFG5HcsP7tkPHR0UynqnNtdrHmdPjDsPfKkTA-b5H00TyPGujYs0ZFMIA7M5H00ULu_5HDsPHbVuZGxnHD3PzYkg1DkrHDVnNtknWcVuZGxnHcdradbX-tknWR4Qywlg1D1rjmVuZGxnHfYPzYkg1DYP1fVuZGxnHf4radbX-tLnHmVnNtLP1TVnfK9mWYsg100ugFM5H00TZ0qn0K8IM0qna3snj0snj0sn0KVIZ0qn0KbuAqs5H00ThCqn0KbugmqTAn0uMfqn0KspjYs0Aq15H00mMTqnH00UMfqn0K1XWY0IZN15HnzPjRvPWR1PjnsPHfLn1fknHc0ThNkIjYkPjn3rHcznWnzrjmY0ZPGujdBn1PWmhRdPj0snjFWm1fz0AP1UHdjrjm3nRnkrDc3PRP7PHn40A7W5HD0mhsqn0KWThnqPjfdrjT&amp;amp;jump=http%3A%2F%2Fkoubei.baidu.com%2Fwomc%2Fp%2Fsentry%3Ftitle%3DFlowPortal%2Bbpm%25EF%25BC%258C%25E4%25B8%25AD%25E5%259B%25BD%25E9%25A1%25B6%25E7%25BA%25A7bpm%25E5%25B9%25B3%25E5%258F%25B0%26q%3DBPM&amp;amp;key=surl&quot; target=&quot;_blank&quot; class=&quot;m&quot; style=&quot;color: rgb(102, 102, 102); text-decoration: none !important;&quot;&gt;评价&lt;/a&gt;&lt;/font&gt;&lt;/div&gt;</aspxform:XTextBox>
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: black 1px solid">
                        Source2</td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox17" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="source2" width="100%">&lt;div class=&quot;KJfzmo&quot; style=&quot;width: 540px; overflow: hidden; font-family: arial; font-size: medium;&quot;&gt;&lt;h2 suda-uatrack=&quot;key=index_feed&amp;amp;value=news_click:-2000:0:0&quot; class=&quot;undefined&quot; style=&quot;color: rgb(0, 0, 0); margin: 0px; padding: 0px; font-size: 20px; height: 28px; line-height: 28px; overflow: hidden; font-family: &#39;Microsoft YaHei&#39;, u5FAEu8F6Fu96C5u9ED1, Arial, SimSun, u5B8Bu4F53;&quot;&gt;&lt;a href=&quot;http://news.sina.com.cn/c/2015-07-21/155632131532.shtml?cre=newspagepc&amp;amp;mod=f&amp;amp;loc=1&amp;amp;r=a&amp;amp;rfunc=2&quot; target=&quot;_blank&quot; style=&quot;color: rgb(51, 51, 51); text-decoration: none;&quot;&gt;十八大以来的整体性发展战略&lt;/a&gt;&lt;/h2&gt;&lt;h2 suda-uatrack=&quot;key=index_feed&amp;amp;value=news_click:-2000:0:0&quot; class=&quot;undefined&quot; style=&quot;margin: 0px; padding: 0px; font-size: 20px; height: 28px; line-height: 28px; overflow: hidden; font-family: &#39;Microsoft YaHei&#39;, u5FAEu8F6Fu96C5u9ED1, Arial, SimSun, u5B8Bu4F53;&quot;&gt;&lt;a href=&quot;http://news.sina.com.cn/c/2015-07-21/155632131532.shtml?cre=newspagepc&amp;amp;mod=f&amp;amp;loc=1&amp;amp;r=a&amp;amp;rfunc=2&quot; class=&quot;feed-card-txt-summary&quot; rel=&quot;nofollow&quot; suda-uatrack=&quot;key=index_feed&amp;amp;value=news_click:-2000:0:0&quot; target=&quot;_blank&quot; style=&quot;color: rgb(51, 51, 51); text-decoration: none; font-size: 15px; font-weight: normal; line-height: 26px;&quot;&gt;党的十八大以来，我国真正步入了整体性发展的新&lt;/a&gt;&lt;/h2&gt;&lt;/div&gt;</aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="557" style="BORDER-TOP: medium none; BORDER-RIGHT: medium none; BORDER-BOTTOM: medium none; BORDER-LEFT: medium none" border="0" cellspacing="0" cellpadding="0" dynamicarea="1,1">
            <tbody>
                <tr>
                    <td width="24" height="20" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                    </td>
                    <td width="424" height="20" align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid" bgcolor="beige">
                        文本 
                    </td>
                    <td width="99" align="center" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none" bgcolor="beige">
                        备注 
                    </td>
                </tr>
                <tr>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XGridLineNo id="XGridLineNo1" runat="server" BorderWidth="1" Height="100%" BorderStyle="None" Width="100%" TextAlign="Center">1</aspxform:XGridLineNo>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
                        <aspxform:XHtmlEditor id="XHtmlEditor3" runat="server" width="100%" height="116px" Express="source2"></aspxform:XHtmlEditor>
                    </td>
                    <td style="BORDER-TOP: medium none; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: medium none">
                        <aspxform:XTextBox id="XTextBox3" runat="server" BorderWidth="1" BorderColor="#DCDCDC" XDataBind="PurchaseDetail.ItemDesc" width="100%"></aspxform:XTextBox>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Insert content here -->
    </form>
</body>
</html>
