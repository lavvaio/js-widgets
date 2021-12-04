# yahoo-quotes



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute   | Description     | Type                  | Default          |
| ------------------------- | ----------- | --------------- | --------------------- | ---------------- |
| `channel` _(required)_    | `channel`   | Prop            | `string`              | `undefined`      |
| `connection` _(required)_ | --          |                 | `WebsocketConnection` | `undefined`      |
| `dataKey`                 | `data-key`  | Prop (optional) | `string`              | `undefined`      |
| `debug`                   | `debug`     |                 | `boolean`             | `false`          |
| `namespace`               | `namespace` | Prop (optional) | `string`              | `'yahoo-quotes'` |
| `useCache`                | `use-cache` | Prop            | `boolean`             | `true`           |


## Methods

### `log(...args: any[]) => Promise<void>`

Method

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [yahoo-quote](.)

### Graph
```mermaid
graph TD;
  yahoo-quotes --> yahoo-quote
  style yahoo-quotes fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
