import { CreditFormValues } from "@/types/credit";

type CreditFormProps = {
  values: CreditFormValues;
  onChange: (field: keyof CreditFormValues, value: string) => void;
  onSubmit: () => void;
};

const fields = [
  { name: "age", label: "Idade", type: "number", placeholder: "Ex.: 32" },
  { name: "monthlyIncome", label: "Renda mensal", type: "number", placeholder: "Ex.: 5000" },
  { name: "loanAmount", label: "Valor do empréstimo", type: "number", placeholder: "Ex.: 12000" },
] as const;

function FormInput(props: { field: (typeof fields)[number]; value: string; onChange: CreditFormProps["onChange"] }) {
  return <div className="field"><label htmlFor={props.field.name}>{props.field.label}</label><input id={props.field.name} min="0" step="0.01" type={props.field.type} value={props.value} placeholder={props.field.placeholder} onChange={(event) => props.onChange(props.field.name, event.target.value)} /></div>;
}

function DebtHistoryField(props: { value: CreditFormValues["debtHistory"]; onChange: CreditFormProps["onChange"] }) {
  return <div className="field"><label htmlFor="debtHistory">Histórico de dívidas</label><select id="debtHistory" value={props.value} onChange={(event) => props.onChange("debtHistory", event.target.value)}><option value="limpo">Limpo</option><option value="negativado">Negativado</option></select></div>;
}

export function CreditForm({ values, onChange, onSubmit }: CreditFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return <form className="form-grid" onSubmit={handleSubmit}>{fields.map((field) => <FormInput field={field} key={field.name} value={values[field.name]} onChange={onChange} />)}<DebtHistoryField value={values.debtHistory} onChange={onChange} /><button className="submit-button" type="submit">Analisar cliente</button></form>;
}
