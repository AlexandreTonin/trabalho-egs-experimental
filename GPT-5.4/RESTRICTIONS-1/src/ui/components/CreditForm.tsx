'use client';

import { CreditFormData } from '@/types/credit';

type CreditFormProps = {
  formData: CreditFormData;
  onDebtHistoryChange: (value: CreditFormData['debtHistory']) => void;
  onNumberChange: (name: NumberFieldName, value: string) => void;
  onSubmit: () => void;
};

type NumberFieldName = 'age' | 'monthlyIncome' | 'loanAmount';
type NumberFieldConfig = { key: NumberFieldName; label: string };

const numericFields: NumberFieldConfig[] = [
  { key: 'age', label: 'Idade' },
  { key: 'monthlyIncome', label: 'Renda mensal' },
  { key: 'loanAmount', label: 'Valor do emprestimo' },
];

// Camada UI: renderiza os campos e delega eventos sem aplicar regras de negocio.
export function CreditForm({ formData, onDebtHistoryChange, onNumberChange, onSubmit }: CreditFormProps) {
  return <section className="panel"><h2 className="section-title">Dados do cliente</h2><p className="helper-text">Preencha os campos e envie para executar a analise.</p><div className="form-grid">{numericFields.map((field) => <NumberField field={field} formData={formData} key={field.key} onNumberChange={onNumberChange} />)}<SelectField value={formData.debtHistory} onChange={onDebtHistoryChange} /><button className="submit-button" type="button" onClick={onSubmit}>Enviar dados</button></div></section>;
}

type NumberFieldProps = {
  field: NumberFieldConfig;
  formData: CreditFormData;
  onNumberChange: (name: NumberFieldName, value: string) => void;
};

function NumberField({ field, formData, onNumberChange }: NumberFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{field.label}</span>
      <input className="field-input" min="0" type="number" value={formData[field.key]} onChange={(event) => onNumberChange(field.key, event.target.value)} />
    </label>
  );
}

type SelectFieldProps = {
  onChange: (value: CreditFormData['debtHistory']) => void;
  value: CreditFormData['debtHistory'];
};

function SelectField({ onChange, value }: SelectFieldProps) {
  return (
    <label className="field">
      <span className="field-label">Historico de dividas</span>
      <select className="field-input" value={value} onChange={(event) => onChange(event.target.value as CreditFormData['debtHistory'])}>
        <option value="limpo">Limpo</option>
        <option value="negativado">Negativado</option>
      </select>
    </label>
  );
}
