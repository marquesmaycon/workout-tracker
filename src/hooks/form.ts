import { createFormHook } from '@tanstack/react-form'

import { CheckboxField } from '@/components/form/checkbox-field'
import { CheckboxGroupField } from '@/components/form/checkbox-group-field'
import { InputField } from '@/components/form/input-field'
import { SelectField } from '@/components/form/select-field'
import { SubmitButton } from '@/components/form/submit-button'
import { TextareaField } from '@/components/form/textarea-field'
import { fieldContext, formContext } from '@/hooks/form-context'

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    InputField,
    SelectField,
    TextareaField,
    CheckboxField,
    CheckboxGroupField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
