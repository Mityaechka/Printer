using System.Collections;
using System.Drawing;
using System.IO;

namespace PrinterUtility
{
        public class BitmapData
        {
            public BitArray Dots
            {
                get;
                set;
            }

            public int Height
            {
                get;
                set;
            }

            public int Width
            {
                get;
                set;
            }
        public static BitmapData GetBitmapData(Stream bitMapStream)
        {
            using (var bitmap = (Bitmap)Bitmap.FromStream(bitMapStream))
            {

                var threshold = 127;
                var index = 0;
                double multiplier = 500;
                double scale = (double)(multiplier / (double)bitmap.Width);
                int xheight = (int)(bitmap.Height * scale);
                int xwidth = (int)(bitmap.Width * scale);
                var dimensions = xwidth * xheight;
                var dots = new BitArray(dimensions);

                for (var y = 0; y < xheight; y++)
                {
                    for (var x = 0; x < xwidth; x++)
                    {
                        var _x = (int)(x / scale);
                        var _y = (int)(y / scale);
                        var color = bitmap.GetPixel(_x, _y);
                        var luminance = (int)(color.R * 0.3 + color.G * 0.59 + color.B * 0.11);
                        dots[index] = (luminance < threshold);
                        index++;
                    }
                }

                return new BitmapData()
                {
                    Dots = dots,
                    Height = (int)(bitmap.Height * scale),
                    Width = (int)(bitmap.Width * scale)
                };
            }
        }
    }

    //static void Main(string[] args)
    //{
    //    GetBytes().Print($"\\\\{ComputerName}\\w180");
    //    Console.Read();
    //}
    //static byte[] GetBytes()
    //{
    //    using (var ms = new MemoryStream())
    //    using (var bw = new BinaryWriter(ms))
    //    {
    //        bw.Write(Encoding.ASCII.GetBytes("\a"));
    //        bw.Write(Encoding.ASCII.GetBytes("1"));
    //        bw.Write(Encoding.ASCII.GetBytes("\n"));
    //        bw.Write(Encoding.ASCII.GetBytes("-----------------------------------"));
    //        bw.Write(Encoding.ASCII.GetBytes("\n"));

    //        bw.Flush();
    //        return ms.ToArray();
    //    }
    //}
}


