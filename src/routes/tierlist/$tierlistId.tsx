import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tierlist/$tierlistId')({
  component: () => <div>Hello /tierlist/$tierlistId!</div>
})