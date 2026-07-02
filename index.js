/* Hady Zen'in */
/* dibuat oleh Hady with love - Copyright HadyZenin 2025 */

const { spawn } = require('child_process');

function hady() {
  const child = spawn("node hady.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
});

  child.on("close", (code) => {
    if (code == 2) {
      hady(); 
  }
 });
};
hady();
