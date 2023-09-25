'use client';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from "html-react-parser";
import styles from '../page.module.css';
import CKeditor from '@/components/controls/CKeditor';

type TextProps = {
    showTextEditor: boolean;
    setRegDataToSave: (name: string, data: any) => void;
};

export const RegiText = forwardRef<CanHandleSubmit, TextProps>((props: TextProps, ref) => {

    const { showTextEditor, setRegDataToSave } = props;
    const [text, setText] = useState('');

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit() {
                alert('handleSubmit');
                setRegDataToSave('text', null);
            }
        }),
    );

    return (
        <>
            {showTextEditor && (<>
                <h1>Text Editor</h1>
                {/* <CKeditor name="description"
                    onChange={(data: string) => { setText(data); }} editorLoaded={showTextEditor} value={''} /> */}
                {/* <div>
                    <CKEditor editor={CKEditor}
                        data=''
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setText(data);
                            console.log({ event, editor, data });
                        }}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                            console.log('Focus.', editor);
                        }}
                    />
                </div> */}
            </>

            )}
            <div>
                <p>{parse(text)}</p>
            </div>

        </>
    );

});

RegiText.displayName = "RegiText"






