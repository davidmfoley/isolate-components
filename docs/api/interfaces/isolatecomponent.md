[isolate-components](../README.md) / IsolateComponent

# Interface: IsolateComponent

This is the type of the main entry point: isolateComponent()

It accepts a React Element that is a modern react component, usually created with JSX, and returns an
[IsolatedComponent](isolatedcomponent.md) that provides methods for manipulating and checking
the results of rendering that component.

**`example`** Quick start

```js
import { isolateComponent } from 'isolated-components'
const Hello = (props) => <h2>Hello {props.name}</h2>
const component = isolateComponent(<Hello name="Zaphod" />)

console.log(component.toString()) // => "<h2>Hello Zaphod</h2>"
```

`isolateComponent` also exposes the method [isolateComponent.withContext](isolatecomponent.md#withcontext) for setting context values for testing.

**`returns`** IsolatedComponent - [IsolatedComponent](isolatedcomponent.md)

## Table of contents

### Properties

- [withContext](isolatecomponent.md#withcontext)

## Properties

### withContext

• **withContext**: <ContextType\>(`type`: *Context*<ContextType\>, `value`: ContextType) => [*IsolateComponent*](isolatecomponent.md)

Set context values, for testing components that use `useContext`.

**`param`** The context type. This is the return value from React.createContext()

**`param`** The value of the context, to set for testing.

Returns a new isolateComponent function that
will include the specifed context, making it
available to components that use `useContext`.

**`example`** <caption>Testing components that use useContext</caption>

```js
const NameContext = React.createContext('')

const HelloWithContext = (props) => {
  const name = useContext(NameContext)
  return  <h2>Hello {nameContext.value}</h2>
}

// To test this component, inject a context value as follows:

const component = isolateComponent.withContext(NameContext, 'Trillian')(<HelloWithContext />)
console.log(component.toString()) // => "<h2>Hello Trillian</h2>"

`withContext` can be chained to set multiple context values
```

#### Type declaration:

▸ <ContextType\>(`type`: *Context*<ContextType\>, `value`: ContextType): [*IsolateComponent*](isolatecomponent.md)

#### Type parameters:

Name |
:------ |
`ContextType` |

#### Parameters:

Name | Type |
:------ | :------ |
`type` | *Context*<ContextType\> |
`value` | ContextType |

**Returns:** [*IsolateComponent*](isolatecomponent.md)
