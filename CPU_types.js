/* CPU */
var cpuTypes = [
                "486 DX 25-7182",
                "486 DX 33-9480",
                "486 DX2 50-14364",
                "486 DX2 66-18961",
                "Pentium 60-17237",
                "Pentium 75-21547"
               ];

function updateCPUtypes() {

  chrome.system.cpu.getInfo(function(cpuInfo) {

    cpuInfo = cpuInfo.modelName.split(" ");
    var cpuStep = cpuInfo[cpuInfo.length - 1];

    if (cpuStep.includes("Hz")) {

      cpuStep = parseFloat(cpuStep.slice(0, [cpuStep.length - 3]));

    } else {

      return;

    }

    if (cpuStep >= 1.4) {
      cpuTypes.push("Pentium 90-25857");
    }
    if (cpuStep >= 1.6) {
      cpuTypes.push("Pentium 100-28730");
    }
    if (cpuStep >= 1.8) {
      cpuTypes.push("Pentium 120-34475");
    }
    if (cpuStep >= 1.9) {
      cpuTypes.push("Pentium 133-38200");
    }
    if (cpuStep >= 2.2) {
      cpuTypes.push("Pentium 150-43000");
    }
    if (cpuStep >= 2.5) {
      cpuTypes.push("Pentium 166-47600");
    }
    if (cpuStep >= 3) {
      cpuTypes.push("Pentium 200-57458");
    }
    if (cpuStep >= 3.5) {
      cpuTypes.push("Pentium 233-66939");
    }

  });

}
