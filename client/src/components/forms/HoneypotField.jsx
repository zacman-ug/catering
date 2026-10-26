/** Hidden field for bots; must stay empty. Server rejects non-empty `companyWebsite`. */
export default function HoneypotField({ value, onChange }) {
  return (
    <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
      <label htmlFor="companyWebsite">Company website</label>
      <input
        id="companyWebsite"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
