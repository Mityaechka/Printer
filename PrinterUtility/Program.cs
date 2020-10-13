using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ESCPOS.Commands;
using ESCPOS;
using ESCPOS.Utils;
using System.IO;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Drawing.Printing;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections;
using System.Text.RegularExpressions;

namespace PrinterUtility
{
    public class Program
    {
        static string computerName = Environment.MachineName.ToString();
        static string path = $"\\\\{computerName}\\w180";
        static void UnhandledExceptionTrapper(object sender, UnhandledExceptionEventArgs e)
        {
            //Console.WriteLine(e.ExceptionObject.ToString());
            //Console.WriteLine("Press Enter to continue");
            PrintString(e.ExceptionObject.ToString());
        }
        public static void Main(string[] args)
        {
            PrintString("test");
            System.AppDomain.CurrentDomain.UnhandledException += UnhandledExceptionTrapper;
            JObject data;
            PrintString("0");
            while ((data = Read()) != null)
            {
                PrintString("1");
                if (!ProcessMessage(data))
                    return;
            }
        }
        public static JObject Read()
        {
            Stream stdin = Console.OpenStandardInput();
            int length = 0;
            byte[] bytes = new byte[4];
            stdin.Read(bytes, 0, 4);
            length = System.BitConverter.ToInt32(bytes, 0);
            string input = "";
            for (int i = 0; i < length; i++)
            {
                input += (char)stdin.ReadByte();
                
            }
            return (JObject)JsonConvert.DeserializeObject<JObject>(input);
        }
        public static bool ProcessMessage(JObject data)
        {
            var commands = data["commands"];
            PrintString("2");
            if (commands != null)
            {
                
                foreach (var command in commands)
                {
                    
                    if (command["print_string"] != null)
                    {
                        var str = command["print_string"].Value<string>();
                        PrintString("4");
                        PrintString(str);
                    }
                    else if (command["print_canvas"] != null)
                    {
                        var canvasString = command["print_canvas"].Value<string>();
                        PrintString("5");
                        PrintCanvas(canvasString);
                    }
                    else if (command["exit"] != null)
                    {
                        return false;
                    }
                }

            }
            return true;
        }
        public static void PrintString(string data)
        {
            var bytes = GetBytes(data);
            bytes.Print(path);
        }
        static void PrintCanvas(string base64string)
        {
            using (Stream fs = new MemoryStream())
            {
                byte[] bytes = Convert.FromBase64String(base64string);

                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    bw.Write(bytes);

                    GetImageFromStream(fs).Print(path);
                    bw.Close();
                }
            }
        }

        public static byte[] GetImageFromStream(Stream bitMapStream)
        {
            BitmapData data = BitmapData.GetBitmapData(bitMapStream);
            BitArray dots = data.Dots;
            byte[] width = BitConverter.GetBytes(data.Width);

            int offset = 0;
            MemoryStream stream = new MemoryStream();
            BinaryWriter bw = new BinaryWriter(stream);

            bw.Write((char)0x1B);
            bw.Write('@');

            bw.Write((char)0x1B);
            bw.Write('3');
            bw.Write((byte)24);

            while (offset < data.Height)
            {
                bw.Write((char)0x1B);
                bw.Write('*');         // bit-image mode
                bw.Write((byte)33);    // 24-dot double-density
                bw.Write(width[0]);  // width low byte
                bw.Write(width[1]);  // width high byte

                for (int x = 0; x < data.Width; ++x)
                {
                    for (int k = 0; k < 3; ++k)
                    {
                        byte slice = 0;
                        for (int b = 0; b < 8; ++b)
                        {
                            int y = (((offset / 8) + k) * 8) + b;
                            // Calculate the location of the pixel we want in the bit array.
                            // It'll be at (y * width) + x.
                            int i = (y * data.Width) + x;

                            // If the image is shorter than 24 dots, pad with zero.
                            bool v = false;
                            if (i < dots.Length)
                            {
                                v = dots[i];
                            }
                            slice |= (byte)((v ? 1 : 0) << (7 - b));
                        }

                        bw.Write(slice);
                    }
                }
                offset += 24;
                bw.Write((char)0x0A);
            }
            // Restore the line spacing to the default of 30 dots.
            bw.Write((char)0x1B);
            bw.Write('3');
            bw.Write((byte)30);
            bw.Write(Encoding.UTF8.GetBytes("\n"));
            bw.Flush();
            byte[] bytes = stream.ToArray();
            return bytes;
        }
        static byte[] GetBytes(string data)
        {
            using (var ms = new MemoryStream())
            using (var bw = new BinaryWriter(ms))
            {
                bw.Write(Encoding.GetEncoding("cp866").GetBytes(data));
                bw.Write(Encoding.UTF8.GetBytes("\n"));

                bw.Flush();
                return ms.ToArray();
            }
        }
        public static void Write(string data)
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(data);

            var stdout = Console.OpenStandardOutput();
            stdout.WriteByte((byte)((bytes.Length >> 0) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 8) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 16) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 24) & 0xFF));
            stdout.Write(bytes, 0, bytes.Length);
            stdout.Flush();
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


// using (Stream fs = new FileStream("C:\\Users\\User\\Pictures\\Saved Pictures\\images.png", FileMode.Open))
//            {

//                using (var bw = new BinaryReader(fs))
//                {
//                    GetLogo(fs).Print($"\\\\{ComputerName}\\w180");
////bytes.Print($"\\\\{ComputerName}\\w180");
////bw.Write(bytes);
//bw.Close();
//                }
//                PrintString("Canvas is");
//PrintString(fs.Length.ToString());
//GetLogo(fs).Print($"\\\\{ComputerName}\\w180");
//            }
//            //using (Stream fs = new FileStream("C:\\Users\\User\\Pictures\\Saved Pictures\\images.png", FileMode.Open))
//            //{
//            //    byte[] bytes = Convert.FromBase64String(base64);

//            //    using (BinaryWriter bw = new BinaryWriter(fs))
//            //    {
//            //        bw.Write(bytes);
//            //        GetLogo(fs).Print($"\\\\{ComputerName}\\w180");
//            //        bw.Close();
//            //    }
//            //}
//            //using (Stream fs = new FileStream("C:\\Users\\User\\Pictures\\Saved Pictures\\img.png", FileMode.Create))
//            //{
//            //    using (var bw = new BinaryWriter(fs))
//            //    {
//            //        bw.Write(Convert.FromBase64String(base64));
//            //        bw.Close();

//            //    }
//            //}
//            using (Stream fs = new MemoryStream())
//            {
//                byte[] bytes = Convert.FromBase64String(base64);

//                using (BinaryWriter bw = new BinaryWriter(fs))
//                {

//                    //bytes.Print($"\\\\{ComputerName}\\w180");
//                    bw.Write(bytes);
//                    PrintString(fs.Length.ToString());
//GetLogo(fs).Print($"\\\\{ComputerName}\\w180");

//bw.Close();

//                }
//            }