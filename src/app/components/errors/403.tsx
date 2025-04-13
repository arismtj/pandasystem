import { Button, Container, Group, Text, Title } from "@mantine/core"
import classes from './error.module.css'

export default function Page403() {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>403</div>
      <Title className={classes.title}>Prohibido.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Parece que no tienes permisos para acceder a esta página
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md">Ir al inicio</Button>
      </Group>
    </Container>
  )
}