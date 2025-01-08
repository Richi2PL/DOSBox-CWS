
function setDOSBoxConfig(VM, autoexecLines) {

  var dosboxConfig = "[sdl]\n" +
                     "fullscreen=false\n" +
                     "fulldouble=false\n" +
                     "fullresolution=original\n" +
                     "windowresolution=original\n" +
                     "output=surface\n" +
                     "autolock=false\n" +
                     "sensitivity=" + VM[0] + "\n" +
                     "waitonerror=true\n" +
                     "priority=higher,normal\n" +
                     "mapperfile=mapper-0.74.map\n" +
                     "usescancodes=true\n" +
                     "[dosbox]\n" +
                     "language=\n" +
                     "machine=svga_s3\n" +
                     "captures=" + CAPTURE + "\n" +
                     "memsize=" + VM[1] + "\n" +
                     "[render]\n" +
                     "frameskip=2\n" +
                     "aspect=false\n" +
                     "scaler=normal2x\n" +
                     "[cpu]\n" +
                     "core=simple\n" +
                     "cputype=" + VM[2] + "\n" +
                     "cycles=" + VM[3] + "\n" +
                     "cycleup=10\n" +
                     "cycledown=20\n" +
                     "[mixer]\n" +
                     "nosound=false\n" +
                     "rate=44100\n" +
                     "blocksize=4096\n" +
                     "prebuffer=20\n" +
                     "[midi]\n" +
                     "mpu401=intelligent\n" +
                     "mididevice=default\n" +
                     "midiconfig=\n" +
                     "[sblaster]\n" +
                     "sbtype=sb1\n" +
                     "sbbase=220\n" +
                     "irq=7\n" +
                     "dma=1\n" +
                     "hdma=5\n" +
                     "sbmixer=true\n" +
                     "oplmode=auto\n" +
                     "oplemu=default\n" +
                     "oplrate=44100\n" +
                     "[gus]\n" +
                     "gus=false\n" +
                     "gusrate=44100\n" +
                     "gusbase=240\n" +
                     "gusirq=5\n" +
                     "gusdma=3\n" +
                     "ultradir=C:\ULTRASND\n" +
                     "[speaker]\n" +
                     "pcspeaker=true\n" +
                     "pcrate=44100\n" +
                     "tandy=auto\n" +
                     "tandyrate=44100\n" +
                     "disney=true\n" +
                     "[joystick]\n" +
                     "joysticktype=auto\n" +
                     "timed=true\n" +
                     "autofire=false\n" +
                     "swap34=false\n" +
                     "buttonwrap=false\n" +
                     "[serial]\n" +
                     "serial1=dummy\n" +
                     "serial2=dummy\n" +
                     "serial3=disabled\n" +
                     "serial4=disabled\n" +
                     "[dos]\n" +
                     "xms=true\n" +
                     "ems=true\n" +
                     "umb=true\n" +
                     "keyboardlayout=auto\n" +
                     "[autoexec]\n" +
                     "@ECHO OFF\n" +
                     "VER SET 7 10\n" +
                     "SET LASTDRIVE=Z\n";

                     if (VFD_0 == true) {
                       if (VHD == true) {
                         dosboxConfig += "IMGMOUNT 0 " + VI_DRIVE + "/VFD_0.IMG -t floppy >NUL\n";
                       } else {
                         dosboxConfig += "IMGMOUNT A " + VI_DRIVE + "/VFD_0.IMG -t floppy >NUL\n";
                         if (VFD_1 == true) {
                           dosboxConfig += "IMGMOUNT B " + VI_DRIVE + "/VFD_1.IMG -t floppy >NUL\n";
                         }
                       }
                     }

                     if (VHD == true) {

                       dosboxConfig += "IMGMOUNT 2 " + VI_DRIVE + "/VHD.IMG -size " + 
                                       BUFFER + "," + SECTORS + "," + HEADS + "," + CYLINDERS +
                                       " -t hdd -fs none >NUL\n";

                       if (VRD == true) {
                         dosboxConfig += "IMGMOUNT 3 " + VI_DRIVE + "/VRD.IMG -size " +
                                         BUFFER + "," + SECTORS + "," + HEADS + "," + CYLINDERS +
                                         " -t hdd -fs none >NUL\n";
                       }

                       if (VFD_0 == true) {
                         dosboxConfig += "BOOT " + VI_DRIVE + "/VFD_0.IMG -l A >NUL\n";
                       } else {
                         dosboxConfig += "BOOT " + VI_DRIVE + "/VHD.IMG -l C";
                       }

                     } else {

                       if (parseInt(VM[4]) == 256) {
                         dosboxConfig += "MOUNT C " + C_DRIVE + " >NUL\n";
                       } else {
                         dosboxConfig += "MOUNT C " + C_DRIVE + " -freesize " + VM[4] + " >NUL\n";
                       }

                       if (VCD == true) {
                         dosboxConfig += "MOUNT D " + D_DRIVE + "/CDROM -t cdrom >NUL\n";
                       }

                       dosboxConfig += "C:\\\n" +
                                       "C:\\DB_TOOLS\\DOS\\DRIVERS\\DOSIDLE\\DOSIDLE.EXE >NUL\n" +
                                       "C:\\DB_TOOLS\\DOS\\DRIVERS\\S3TRIO64\\S3VBE318\\S3VBE20.EXE VBE20- LINEAR+ LOWRES+ /LOAD >NUL\n" +
                                       "C:\\DB_TOOLS\\DOS\\DRIVERS\\S3TRIO64\\S3SPDUP\\S3SPDUP.EXE VESA+ VGA+ /LOAD >NUL\n" +
                                       "IF EXIST C:\\*.HAS DEL C:\\*.HAS\n" +
                                       autoexecLines;
                     }

  return dosboxConfig;
                    	
}
