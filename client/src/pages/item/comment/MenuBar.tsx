import { Editor } from '@tiptap/react';
import { memo, useEffect, useMemo, useState } from 'react';
import { Button, Card, ToggleButton } from 'react-bootstrap';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading2,
    ListIcon,
    ListOrdered,
    Undo,
    Redo,
} from 'lucide-react';
import { nanoid } from '@reduxjs/toolkit';
import { DropdownWrapper, TooltipOverlay } from '../../../components';
import { useLocale } from '../../../contexts/locale';

const MenuBar = memo(function MenuBar({
    editor,
    buttonText,
    sm = false,
    xs = false,
}: {
    editor: Editor | null;
    buttonText: string;
    sm?: boolean;
    xs?: boolean;
}) {
    const defaultState = useMemo(
        () =>
            ({
                bold: false,
                italic: false,
                strike: false,
                code: false,
                heading: false,
                bulletList: false,
                orderedList: false,
            } as const),
        []
    );
    const [editorActiveState, setEditorActiveState] = useState(() => defaultState);

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.on('update', ({ editor }) => {
            Object.keys(defaultState).forEach((key) => {
                setEditorActiveState((prev) => ({
                    ...prev,
                    [key]: editor.isActive(key),
                }));
            });
        });

        return () => {
            editor.off('update');
        };
    }, [defaultState, editor]);

    const t = useLocale('itemPage');

    if (!editor) {
        return null;
    }

    return (
        <Card className='rounded-top-0 rounded-bottom-2 border-top-0'>
            <Card.Footer className='p-0 border-top-0'>
                <div className='my-2 mx-3 d-flex justify-content-between align-items-center'>
                    <div className={`d-flex gap-${sm || xs ? 'xl' : 'lg'}-4 gap-1`}>
                        <DropdownWrapper
                            collapseOnBreakpoing={xs ? 'md' : sm ? 'sm' : 'xs'}
                            tooltipMessage={t('more1')}
                        >
                            <div
                                className={`d-flex gap-${xs || sm ? 'xl' : 'lg'}-2 gap-1`}
                            >
                                <TooltipOverlay
                                    id={'tooltip' + 'bold' + nanoid()}
                                    tooltipMessage={t('bold')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'bold' + nanoid()}
                                        value={'Bold'}
                                        type='checkbox'
                                        checked={editorActiveState.bold}
                                        onClick={() =>
                                            editor.chain().focus().toggleBold().run()
                                        }
                                        disabled={
                                            !editor
                                                .can()
                                                .chain()
                                                .focus()
                                                .toggleBold()
                                                .run()
                                        }
                                        className='border-0  d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <Bold size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                                <TooltipOverlay
                                    id={'tooltip' + 'italic' + nanoid()}
                                    tooltipMessage={t('italic')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'italic' + nanoid()}
                                        value={'italic'}
                                        type='checkbox'
                                        checked={editorActiveState.italic}
                                        onClick={() =>
                                            editor.chain().focus().toggleItalic().run()
                                        }
                                        disabled={
                                            !editor
                                                .can()
                                                .chain()
                                                .focus()
                                                .toggleItalic()
                                                .run()
                                        }
                                        className='border-0 d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <Italic size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                                <TooltipOverlay
                                    id={'tooltip' + 'strike' + nanoid()}
                                    tooltipMessage={t('strike')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'strike' + nanoid()}
                                        value={'strike'}
                                        type='checkbox'
                                        checked={editorActiveState.strike}
                                        onClick={() =>
                                            editor.chain().focus().toggleStrike().run()
                                        }
                                        disabled={
                                            !editor
                                                .can()
                                                .chain()
                                                .focus()
                                                .toggleStrike()
                                                .run()
                                        }
                                        className='border-0 d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <Strikethrough size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                                <TooltipOverlay
                                    id={'tooltip' + 'code' + nanoid()}
                                    tooltipMessage={t('code')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'code' + nanoid()}
                                        value={'code'}
                                        type='checkbox'
                                        checked={editorActiveState.code}
                                        onClick={() =>
                                            editor.chain().focus().toggleCode().run()
                                        }
                                        disabled={
                                            !editor
                                                .can()
                                                .chain()
                                                .focus()
                                                .toggleCode()
                                                .run()
                                        }
                                        className='border-0 d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <Code size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                                <TooltipOverlay
                                    id={'tooltip' + 'heading' + nanoid()}
                                    tooltipMessage={t('h2')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'heading' + nanoid()}
                                        value={'heading'}
                                        type='checkbox'
                                        checked={editorActiveState.heading}
                                        onClick={() =>
                                            editor
                                                .chain()
                                                .focus()
                                                .toggleHeading({ level: 2 })
                                                .run()
                                        }
                                        className='border-0 d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <Heading2 size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                            </div>
                        </DropdownWrapper>
                        {!xs && (
                            <div className={`vr d-${sm ? 'xl' : 'lg'}-block d-none`} />
                        )}
                        <DropdownWrapper
                            collapseOnBreakpoing={xs ? 'xl' : sm ? 'lg' : 'md'}
                            tooltipMessage={t('more2')}
                        >
                            <div className='d-flex gap-lg-2 gap-1'>
                                <TooltipOverlay
                                    id={'tooltip' + 'bulletList' + nanoid()}
                                    tooltipMessage={t('bulletList')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'bulletList' + nanoid()}
                                        value={'bulletList'}
                                        type='checkbox'
                                        checked={editorActiveState.bulletList}
                                        onClick={() =>
                                            editor
                                                .chain()
                                                .focus()
                                                .toggleBulletList()
                                                .run()
                                        }
                                        className='border-0 d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <ListIcon size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                                <TooltipOverlay
                                    id={'tooltip' + 'orderedList' + nanoid()}
                                    tooltipMessage={t('orderedList')}
                                    placement='bottom'
                                >
                                    <ToggleButton
                                        id={'orderedList' + nanoid()}
                                        value={'orderedList'}
                                        type='checkbox'
                                        checked={editorActiveState.orderedList}
                                        onClick={() =>
                                            editor
                                                .chain()
                                                .focus()
                                                .toggleOrderedList()
                                                .run()
                                        }
                                        className='border-0 d-flex align-items-center'
                                        variant='outline-secondary'
                                        size='sm'
                                    >
                                        <ListOrdered size={21} />
                                    </ToggleButton>
                                </TooltipOverlay>
                            </div>
                        </DropdownWrapper>
                        {!xs && (
                            <div className={`vr d-${sm ? 'xl' : 'lg'}-block d-none`} />
                        )}
                        {!xs && (
                            <DropdownWrapper
                                collapseOnBreakpoing={sm ? 'xl' : 'lg'}
                                tooltipMessage={t('more3')}
                            >
                                <div className='d-flex gap-lg-2 gap-1'>
                                    <TooltipOverlay
                                        id={'tooltip' + 'undo' + nanoid()}
                                        tooltipMessage={t('undo')}
                                        placement='bottom'
                                    >
                                        <Button
                                            onClick={() =>
                                                editor.chain().focus().undo().run()
                                            }
                                            disabled={
                                                !editor.can().chain().focus().undo().run()
                                            }
                                            className='border-0 d-flex align-items-center'
                                            variant='outline-secondary'
                                            size='sm'
                                        >
                                            <Undo size={21} />
                                        </Button>
                                    </TooltipOverlay>
                                    <TooltipOverlay
                                        id={'tooltip' + 'redo' + nanoid()}
                                        tooltipMessage={t('redo')}
                                        placement='bottom'
                                    >
                                        <Button
                                            onClick={() =>
                                                editor.chain().focus().redo().run()
                                            }
                                            disabled={
                                                !editor.can().chain().focus().redo().run()
                                            }
                                            className='border-0 d-flex align-items-center'
                                            variant='outline-secondary'
                                            size='sm'
                                        >
                                            <Redo size={21} />
                                        </Button>
                                    </TooltipOverlay>
                                </div>
                            </DropdownWrapper>
                        )}
                    </div>
                    {!sm && !xs && (
                        <Button
                            type='submit'
                            className='text-nowrap'
                            variant='outline-primary'
                            size='sm'
                        >
                            {buttonText}
                        </Button>
                    )}
                </div>
            </Card.Footer>
        </Card>
    );
});

export default MenuBar;
