import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import './shiki.scss';

type ShikiProps = {};

type ArrayType<T> = T extends (infer V)[] ? V : T;

const Shiki: React.FC<ShikiProps> = props => {
  const {} = props;
  const code = `  useEffect(() => {
    setData();
  }, []);`; // input code

  const [html, setHtml] = useState<string>('');

  const lines = ['28', 'xxx', 'custom string'];

  async function setData() {
    const h = await codeToHtml(code, {
      lang: 'typescript',
      theme: 'tokyo-night',
      transformers: [
        {
          code: node => {
            console.log(`node`, node);
            let lineNumberIdx = -1;

            const lineNumberElement: ArrayType<(typeof node)['children']> = {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line-number' },
              children: node.children.map(
                (content): ArrayType<(typeof node)['children']> => {
                  if (content.type === 'text' && content.value === '\n') {
                    return {
                      ...content,
                    };
                  } else {
                    lineNumberIdx++;
                    return {
                      type: 'element',
                      tagName: 'span',
                      properties: { class: 'line-number' },
                      children: [
                        {
                          type: 'text',
                          value: lines[lineNumberIdx],
                        },
                      ],
                    };
                  }
                }
              ),
            };

            const lineElement: ArrayType<(typeof node)['children']> = {
              type: 'element',
              tagName: 'span',
              properties: { class: 'line-container' },
              children: [...node.children],
            };

            node.children = [lineNumberElement, lineElement];
          },
        },
      ],
    });

    setHtml(h);
  }

  useEffect(() => {
    setData();
  }, []);

  return (
    <>
      <div className="code" dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
  );
};

Shiki.displayName = 'Shiki';

export default Shiki;
