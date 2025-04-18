// app/components/AsyncAutocompleteCombobox.tsx
'use client'

import { SelectDTO } from '@/lib/dto/common.dto'
import { Combobox, Loader, TextInput, TextInputProps, useCombobox } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { useState } from 'react'

type OmitedProps = 'value' | 'onClick' | 'onFocus' | 'onBlur' | 'rightSection'

interface AsyncAutocomplete extends Omit<TextInputProps, OmitedProps> {
  serverFunction: Function
  minQueryText?: number
  onSelect?: (value: any) => void
}

export function AsyncAutocomplete({ serverFunction, onSelect, minQueryText = 3, ...props }: AsyncAutocomplete) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SelectDTO[] | null>(null)
  const [value, setValue] = useState('')

  const fetchOptions = useDebouncedCallback(async (query: string) => {
    setLoading(true)
    try {
      // Llamamos a la server action; en un entorno real, aquí se consultaría la BD
      const suggestions = await serverFunction(query)
      setData(suggestions)
    } catch (error) {
      console.error('Error al obtener sugerencias:', error)
    } finally {
      setLoading(false)
    }
  }, 500)

  const options = (data || []).map(item => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ))

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        const selected = data?.find(item => item.value === optionValue)

        if (props.onChange) {
          props.onChange(selected?.value as any)
        }

        setValue(selected?.label || '')
        onSelect?.(selected)

        combobox.closeDropdown()
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          {...props}
          value={value}
          onChange={(event) => {
            const query = event.currentTarget.value
            setValue(query)
            fetchOptions(query)
            combobox.resetSelectedOption()
            combobox.openDropdown()
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown()
            console.log('asdasd');
            
            if (data === null) {
              fetchOptions(value)
            }
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={loading && <Loader size={18} />}
        />
      </Combobox.Target>
      <Combobox.Dropdown hidden={!data}>
        <Combobox.Options>
          {options}
          {options.length === 0 && <Combobox.Empty>No se encontraron resultados</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export type AsyncAutocompleteComboboxProps = {
  value?: SelectDTO | null
  onChange?: (value: SelectDTO | null) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  error?: string | boolean
  label?: string
  placeholder?: string
  serverFunction: Function
}