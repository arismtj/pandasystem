// app/components/AsyncAutocompleteCombobox.tsx
'use client'

import { SelectDTO } from '@/lib/dto/common.dto'
import { Combobox, Loader, TextInput, TextInputProps, useCombobox } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { ChangeEvent, useEffect, useState } from 'react'

type OmitedProps = 'value' | 'onClick' | 'onFocus' | 'onBlur' | 'rightSection'

interface AsyncAutocomplete extends Omit<TextInputProps, OmitedProps> {
  serverFunction: Function
  defaultItemLabel?: string
  minQueryText?: number
  onSelect?: (value: any) => void
}

export function AsyncAutocomplete({
  serverFunction,
  onSelect,
  minQueryText = 3,
  defaultValue,
  defaultItemLabel,
  ...props
}: AsyncAutocomplete) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const defaultItemSelect = defaultItemLabel && defaultValue ? { label: defaultItemLabel, value: `${defaultValue}` } : null

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SelectDTO[] | null>(defaultItemSelect ? [defaultItemSelect] : null)
  const [value, setValue] = useState(defaultItemLabel || '')

  async function fetchOptionsAsync(query: string, defaultVal?: string) {
    if (query.length < minQueryText && !defaultVal) {
      return
    }

    setLoading(true)
    try {
      const suggestions: SelectDTO[] = await serverFunction(query, defaultValue)
      setData(defaultItemSelect ? [defaultItemSelect, ...suggestions] : suggestions)

      if (defaultVal) {
        const defaultItem = suggestions.find(item => item.value === defaultVal)
        defaultItem && setValue(defaultItem.label)
      }

    } catch (error) {
      console.error('Error al obtener sugerencias:', error)
    } finally {
      setLoading(false)
    }
  }
  const fetchOptions = useDebouncedCallback(fetchOptionsAsync, 500)

  // Función que se ejecuta cuando se selecciona una opción
  function onOptionSubmit(optionValue: string) {
    const selected = data?.find(item => item.value === optionValue)

    if (props.onChange) {
      props.onChange(selected?.value as any)
    }

    setValue(selected?.label || '')
    onSelect?.(selected)

    combobox.closeDropdown()
  }

  // Función que se ejecuta cuando se escribe en el campo de texto
  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    const query = event.currentTarget.value
    setValue(query)
    fetchOptions(query)
    combobox.resetSelectedOption()
    combobox.openDropdown()
  }

  // Funcion que se ejecuta cuando se le hace focus al campo de texto
  function onInputFocus() {
    combobox.openDropdown()

    if (data === null) {
      fetchOptions(value)
    }
  }

  useEffect(() => {
    if (defaultValue) {
      fetchOptionsAsync(value, defaultValue.toString())
    }
  }, [])

  const options = (data || []).map(item => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ))

  return (
    <Combobox
      onOptionSubmit={onOptionSubmit}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          {...props}
          value={value}
          onChange={onTextChange}
          onClick={() => combobox.openDropdown()}
          onFocus={onInputFocus}
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

export function AsyncAutocompleteFilter({ onSelect, defaultValue, name, ...props }: AsyncAutocomplete) {
  const [value, setValue] = useState<string>('')
  return <>
    <input name={name} value={value || defaultValue || ''} hidden readOnly />

    <AsyncAutocomplete
      onSelect={(data: SelectDTO) => {
        setValue(data.value)
        onSelect?.(data)
      }}
      defaultChecked
      defaultValue={defaultValue?.toString() || ''}
      {...props}
    />
  </>
}