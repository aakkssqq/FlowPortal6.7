using System;
using System.Data;
using System.Configuration;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

/// <summary>
/// YZUtility 的摘要说明


/// </summary>
public class YZImageHelper
{
    public static Bitmap FromBase64String(string data)
    {
        int index = data.IndexOf(',');
        if (index != -1)
            data = data.Substring(index + 1);

        byte[] bytes = Convert.FromBase64String(data);

        using (MemoryStream ms = new MemoryStream(bytes))
        {
            //return Image.FromStream(ms);
            return new Bitmap(ms);
        }
    }

    public static Bitmap ClipImage(Bitmap image,Rectangle rect)
    {
        rect.X = Math.Max(rect.X, 0);
        rect.Y = Math.Max(rect.Y, 0);
        rect.Width = Math.Min(rect.Width, image.Width - rect.X);
        rect.Height = Math.Min(rect.Height, image.Height - rect.Y);

        return image.Clone(rect, image.PixelFormat);
    }

    public static Image CreateThumbnail(Image image, int width, int height)
    {
        decimal rate;

        //*** If the image is smaller than a thumbnail just return it
        if (image.Width <= width && image.Height <= height)
            return image;

        if (image.Width > image.Height)
        {
            rate = (decimal)width / image.Width;
            height = (int)(image.Height * rate);
        }
        else
        {
            rate = (decimal)height / image.Height;
            width = (int)(image.Width * rate);
        }

        return ResizeImage(image, width, height);
    }

    public static Bitmap ResizeImage(Image image, int width, int height)
    {
        Rectangle destRect = new Rectangle(0, 0, width, height);
        Bitmap destImage = new Bitmap(width, height);

        destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

        using (Graphics graphics = Graphics.FromImage(destImage))
        {
            graphics.CompositingMode = CompositingMode.SourceCopy;
            graphics.CompositingQuality = CompositingQuality.HighQuality;
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

            graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel);
        }

        return destImage;
    }

    public static Bitmap CenterImage(Image image, int width, int height)
    {
        Rectangle destRect = new Rectangle((width - image.Width) / 2, (height - image.Height) / 2, image.Width, image.Height);
        Bitmap destImage = new Bitmap(width, height);

        destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

        using (Graphics graphics = Graphics.FromImage(destImage))
        {
            graphics.CompositingMode = CompositingMode.SourceCopy;
            graphics.CompositingQuality = CompositingQuality.HighQuality;
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

            graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel);
        }

        return destImage;
    }

    public static ImageFormat ParseImageFormat(string format)
    {
        if (!String.IsNullOrEmpty(format))
        {
            format = format.ToLower();

            switch (format)
            {
                case "memorybmp":
                    return ImageFormat.MemoryBmp;
                case "bmp":
                    return ImageFormat.Bmp;
                case "emf":
                    return ImageFormat.Emf;
                case "wmf":
                    return ImageFormat.Wmf;
                case "gif":
                    return ImageFormat.Gif;
                case "jpeg":
                    return ImageFormat.Jpeg;
                case "jpg":
                    return ImageFormat.Jpeg;
                case "png":
                    return ImageFormat.Png;
                case "tiff":
                    return ImageFormat.Tiff;
                case "exif":
                    return ImageFormat.Exif;
                case "icon":
                    return ImageFormat.Icon;
            }
        }

        return ImageFormat.Png;
    }
}
