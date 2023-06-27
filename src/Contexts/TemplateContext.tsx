import { createContext, useState } from "react";

export type TemplateProps = {
    template: TTemplate | null,
    setTemplate: (template: TTemplate) => void,
    reset: () => void,
    name: string,
    setName: (name: string) => void,
    fields: TField[],
    setFields: (fields: TField[]) => void,
}

export type ExtractTypes = 'text' | 'number' | 'date'

export type TField = {
    name: string,
    type: ExtractTypes,
    example: string,
}

export type TTemplate = {
    template_id: string | null,
    name: string,
    description: string,
    created_at: string | null,
    fields: Array<TField>,
}

export const TemplateContext = createContext<TemplateProps>(
    {
        template: null,
        setTemplate: () => { },
        reset: () => { },
        name: '',
        setName: () => { },
        fields: [{ name: '', type: 'text', example: '' }],
        setFields: () => { },
    })

type AppContextProviderProps = {
    children: React.ReactNode;
};

export const TemplateProvider = ({ children }: AppContextProviderProps) => {
    const [template, setTemplate] = useState<TTemplate | null>(null)
    const [name, setName] = useState<string>('')
    const [fields, setFields] = useState<TField[]>([{ name: '', type: 'text', example: '' }])
    const reset = () => { 
        setTemplate(null) 
        setName('')
        setFields([{ name: '', type: 'text', example: '' }])
    }
    const templateContextValue = {
        template,
        setTemplate,
        reset,
        name,
        setName,
        fields,
        setFields,
    }

    return (
        <TemplateContext.Provider value={templateContextValue}>
            {children}
        </TemplateContext.Provider>
    );
};