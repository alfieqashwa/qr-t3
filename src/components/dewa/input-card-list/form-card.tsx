import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"

type FormCardProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  label: string
  inputName: string
  placeholder: string
  buttonText: string
}

export const FormCard = (props: FormCardProps) => {
  return (
    <form
      onSubmit={props.handleSubmit}
      className="max-w-xl rounded-lg border-2 p-8"
    >
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor={props.inputName}>{props.label}</Label>
        <Input
          id={props.inputName}
          type="text"
          name={props.inputName}
          placeholder={props.placeholder}
        />
      </div>
      <div className="mt-8 flex justify-end">
        <Button type="submit" size="sm" variant="destructive">
          {props.buttonText}
        </Button>
      </div>
    </form>
  )
}
