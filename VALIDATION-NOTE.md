# Nota de validación del entorno de entrega

El proyecto está preparado para Node.js 24.19.0 y pnpm 11.23.0. En el entorno aislado usado para generar esta entrega, las conexiones salientes desde el shell hacia `registry.npmjs.org:443` están bloqueadas. Por ese motivo no fue posible ejecutar de forma honesta `corepack pnpm install`, generar/verificar `pnpm-lock.yaml` ni correr `astro check`/`astro build` contra dependencias instaladas.

No se ha incluido un lockfile inventado o parcialmente generado: hacerlo rompería `--frozen-lockfile` y daría una falsa señal de reproducibilidad. El código fuente, configuración y recursos quedan listos para ejecutar la secuencia indicada en README en un entorno con acceso al registro npm.
