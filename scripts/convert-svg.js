const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\AvaricE\\.gemini\\antigravity-ide\\brain\\fa833fae-a6d2-4378-a51f-77bfba1aba1a\\.system_generated\\steps\\107\\content.md';
const destDir = 'c:\\Users\\AvaricE\\Documents\\Personal-Website\\src\\components';
const destPath = path.join(destDir, 'WorldMapSVG.tsx');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Reading file...');
const rawContent = fs.readFileSync(srcPath, 'utf8');

// Find the start of the XML/SVG content
const lines = rawContent.split('\n');
const svgStartIndex = lines.findIndex(line => line.trim().startsWith('<svg'));

if (svgStartIndex === -1) {
  console.error('Could not find SVG start tag');
  process.exit(1);
}

const svgContentLines = lines.slice(svgStartIndex);
let svgContent = svgContentLines.join('\n');

// Clean up any markdown block quotes or trailing characters if needed
// The file ends with </svg> and some empty lines
const svgEndIndex = svgContent.lastIndexOf('</svg>');
if (svgEndIndex !== -1) {
  svgContent = svgContent.substring(0, svgEndIndex + 6);
}

console.log('Extracting paths...');

// Let's parse paths
// We will replace class="..." with className="..."
// We will replace baseprofile="..." with baseProfile="..."
// We will replace viewbox="..." with viewBox="..."
let cleanedSvg = svgContent
  .replace(/class=/g, 'className=')
  .replace(/baseprofile=/g, 'baseProfile=')
  .replace(/viewbox=/g, 'viewBox=')
  .replace(/stroke-width=/g, 'strokeWidth=')
  .replace(/stroke-linecap=/g, 'strokeLinecap=')
  .replace(/stroke-linejoin=/g, 'strokeLinejoin=');

// Now, we want to extract the paths from this SVG and wrap it in a React component.
// We can just keep the SVG tag, but make it clean:
// Remove the hardcoded width/height so it's responsive.
// Let's replace the opening <svg ...> tag with a custom one that accepts props.
cleanedSvg = cleanedSvg.replace(/<svg[^>]*>/, (match) => {
  return `<svg 
  viewBox="0 0 2000 857" 
  className={className} 
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  stroke="currentColor"
  strokeWidth="0.2"
  strokeLinecap="round"
  strokeLinejoin="round"
  {...props}
>`;
});

// Also remove any hardcoded circles at the end of the SVG (lines 979-984 in original file)
cleanedSvg = cleanedSvg.replace(/<circle[^>]*>[\s\S]*?<\/circle>/gi, '');
cleanedSvg = cleanedSvg.replace(/<circle[^>]*\/>/gi, '');

// Insert {children} before </svg>
cleanedSvg = cleanedSvg.replace('</svg>', '  {children}\n</svg>');

const tsxContent = `'use client';

import React from 'react';

interface WorldMapSVGProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  className?: string;
}

export function WorldMapSVG({ children, className, ...props }: WorldMapSVGProps) {
  return (
    ${cleanedSvg}
  );
}

export default WorldMapSVG;
`;

fs.writeFileSync(destPath, tsxContent, 'utf8');
console.log('Successfully wrote WorldMapSVG.tsx');
