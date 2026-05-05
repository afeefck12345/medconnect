const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'medconnect-frontend', 'src', 'pages');

function processFile(filePath, role) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it already uses DashboardLayout to avoid double processing
  if (content.includes('DashboardLayout')) return;

  // 1. Add Import
  const importStatement = `import DashboardLayout from '../../components/DashboardLayout'\n`;
  content = importStatement + content;

  // 2. Remove FontLoader definition
  content = content.replace(/const FontLoader = \(\) => \([\s\S]*?\}\<\/style\>\n\)\n/g, '');
  content = content.replace(/const FontLoader = \(\) => \{\n  useEffect\(\(\) => \{[\s\S]*?return null\n\}\n/g, '');

  // 3. Remove navLinks definition
  content = content.replace(/const navLinks = \[[\s\S]*?\]\n/g, '');

  // 4. Remove handleLogout
  content = content.replace(/const handleLogout = \(\) => \{[\s\S]*?\}\n/g, '');
  content = content.replace(/const handleLogout = \(\) => \{ dispatch\(logout\(\)\); navigate\('\/login'\) \}\n/g, '');

  // 5. Remove sidebar variables
  content = content.replace(/const sidebarCollapsed = [^\n]*\n/g, '');
  content = content.replace(/const \[sidebarCollapsed, setSidebarCollapsed\] = useState\(false\)\n/g, '');
  content = content.replace(/const sidebarW = [^\n]*\n/g, '');
  
  // 6. Remove `const sidebar = ( ... )`
  content = content.replace(/const sidebar = \([\s\S]*?<\/aside>\n  \)\n/g, '');

  // Remove `<FontLoader />`
  content = content.replace(/<FontLoader \/>\n/g, '');
  // Remove `{sidebar}`
  content = content.replace(/\{sidebar\}\n/g, '');
  
  // Remove `<aside>...</aside>` inline
  content = content.replace(/<aside style=\{\{[\s\S]*?<\/aside>\n/g, '');

  // Remove `<!-- MAIN -->` comments
  content = content.replace(/\{\/\* ══════════════ MAIN ══════════════ \*\/\}\n/g, '');

  // Replace wrapper `return (`
  // Many instances of `<div style={{ display: 'flex', minHeight: '100vh', ... }}>`
  content = content.replace(/<div style=\{\{\s*display: 'flex',\s*minHeight: '100vh'[\s\S]*?>/g, `<DashboardLayout role="${role}">`);
  
  // Remove `<main>` tags (we'll let DashboardLayout handle it)
  // Sometimes it's multi-line, sometimes single line
  content = content.replace(/<main style=\{\{\s*marginLeft: sidebarW.*?>/g, '');
  content = content.replace(/<main style=\{\{ marginLeft: sidebarW.*?}}.*?>/g, '');

  // And replace `</main>\n    </div>` with `</DashboardLayout>`
  content = content.replace(/<\/main>[\s\n]*<\/div>/g, '</DashboardLayout>');
  content = content.replace(/<\/div>[\s\n]*\)$/gm, '</DashboardLayout>\n  )');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

function traverseDir(dir, role) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath, role);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath, role);
    }
  }
}

// Special pre-processing to fix DoctorDashboard.jsx broken EOF before regex applies
const docDashPath = path.join(srcDir, 'doctor', 'DoctorDashboard.jsx');
if (fs.existsSync(docDashPath)) {
  let docDashContent = fs.readFileSync(docDashPath, 'utf8');
  const brokenIndex = docDashContent.indexOf('export default DoctorDashboard\n                  <div className="flex items-center gap-3">');
  if (brokenIndex !== -1) {
    docDashContent = docDashContent.substring(0, brokenIndex + 'export default DoctorDashboard\n'.length);
    fs.writeFileSync(docDashPath, docDashContent, 'utf8');
    console.log('Fixed DoctorDashboard.jsx syntax error.');
  }
}

traverseDir(path.join(srcDir, 'patient'), 'patient');
traverseDir(path.join(srcDir, 'doctor'), 'doctor');
traverseDir(path.join(srcDir, 'admin'), 'admin');

console.log('Done processing pages.');
