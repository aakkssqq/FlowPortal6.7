using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.Web.UI.DataVisualization.Charting;

/// <summary>
/// YZChartHelper 的摘要说明

/// </summary>
public class YZChartHelper
{
    public static void ApplayChartStyle(Chart chart)
    {
        //chart.BackColor = Color.FromArgb(0xF3, 0xDF, 0xC1);
        //chart.Palette = ChartColorPalette.Pastel;
        //chart.BackGradientStyle = GradientStyle.TopBottom;

        Title title = new Title("title", Docking.Top, new System.Drawing.Font("Tahoma", 14, FontStyle.Bold), Color.FromArgb(26, 59, 105));
        title.ShadowColor = Color.FromArgb(32, 0, 0, 0);
        title.ShadowOffset = 3;
        chart.Titles.Add(title);

        //Title subtitle = new Title("subtitle", Docking.Top, new System.Drawing.Font("Tahoma", 8, FontStyle.Regular), Color.FromArgb(26, 59, 105));
        //subtitle.Alignment = ContentAlignment.BottomRight;
        //chart.Titles.Add(subtitle);

        //chart.BorderSkin.SkinStyle = BorderSkinStyle.Emboss;

        chart.ChartAreas.Add("Default");
        //chart.ChartAreas[0].BorderColor = Color.FromArgb(64, 64, 64, 64);
        //chart.ChartAreas[0].BorderColor = Color.Red;
        //chart.ChartAreas[0].BackSecondaryColor = Color.White;
        chart.ChartAreas[0].BackColor = Color.Transparent;
        //chart.ChartAreas[0].ShadowColor = Color.Transparent;
        chart.ChartAreas[0].Area3DStyle.Perspective = 1;
        chart.ChartAreas[0].Area3DStyle.Enable3D = false;
        chart.ChartAreas[0].Area3DStyle.Rotation = 30;
        chart.ChartAreas[0].Area3DStyle.Inclination = 18;
        chart.ChartAreas[0].Area3DStyle.IsRightAngleAxes = false;
        chart.ChartAreas[0].Area3DStyle.WallWidth = 0;
        chart.ChartAreas[0].Area3DStyle.IsClustered = false;

        chart.ChartAreas[0].AxisY.LineColor = Color.FromArgb(64, 64, 64, 64);
        chart.ChartAreas[0].AxisY.IsLabelAutoFit = false;
        chart.ChartAreas[0].AxisY.LabelStyle.Font = new Font("Tahoma", 8, FontStyle.Regular);
        chart.ChartAreas[0].AxisY.MajorGrid.LineColor = Color.FromArgb(64, 64, 64, 64);

        chart.ChartAreas[0].AxisX.LineColor = Color.FromArgb(64, 64, 64, 64);
        chart.ChartAreas[0].AxisX.IsLabelAutoFit = false;
        chart.ChartAreas[0].AxisX.Interval = 1;
        chart.ChartAreas[0].AxisX.LabelStyle.Font = new Font("Tahoma", 8, FontStyle.Regular);
        chart.ChartAreas[0].AxisX.MajorGrid.LineColor = Color.FromArgb(64, 64, 64, 64);
    }
}
