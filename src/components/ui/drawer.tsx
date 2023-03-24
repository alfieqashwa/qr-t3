import { useDisclosure } from '@mantine/hooks'
import { Drawer, Button, Group } from '@mantine/core'

export function DrawerUI() {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
        <ul>
          <li>Home</li>
          <li>Dashboard</li>
          <li>Setting</li>
        </ul>
      </Drawer>

      <Group position="center">
        <Button onClick={open}>Open Drawer</Button>
      </Group>
    </>
  )
}