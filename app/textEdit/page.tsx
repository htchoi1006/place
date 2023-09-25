'use client'
import Image from 'next/image'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from "html-react-parser";
import { useState } from 'react';

export default function TextEditpage() {
  const [data, setData] = useState<string>("");
  return (
    <main className='container'>
     <h2>Using CKEditor&nbsp;5 build in NextJs</h2>
      <CKEditor
        editor={ClassicEditor}
        data=''
        onReady={editor => {
          // You can store the "editor" and use when it is needed.
          // console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setData(data);
          // console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          // console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          // console.log('Focus.', editor);
        }}
      />

      <div>
        <h2>Content</h2>
        <p>{parse(data)}</p>
      </div>
    </main>
  )
}
