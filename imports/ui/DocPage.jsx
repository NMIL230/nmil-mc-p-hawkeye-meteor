import * as React from 'react';
import { Typography } from '@mui/material';

function DocumentationPage() {
  // 这里将 Markdown 文档转换为 HTML，例如使用 markdown-to-jsx 库
  const markdownDocument = `
    # Documentation

    Some markdown documentation...

    ## Subsection

    More details...
  `;

  return (
    <Typography component="div">
      {/* 渲染 Markdown 文档 */}
    </Typography>
  );
}

export default DocumentationPage;
