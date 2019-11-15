# 🚀 schemaa
A fast, lightweight and flexible schema-based verifier and sanitizer. The goal of the project is to provide a schema that can be used widely across SQL and NoSQL databases, incoming requests, outgoing requests, and more.

# 📝 Project Goals
- Works across Node and Browser
- Simple implementation (No behind the scenes magic)
- Lightweight <5kb gzipped
- Fast
- Minimal nesting and boilerplate
- Testable
- Plugin system for conversion between various schemas (Mongoose, Sequelize, etc)

The developers using the library should be able to write one extensible and simple schema that can be converted to Mongoose while also being able to validate incoming requests, form data, and any other form of data. Similar to `react`, the library should be close to JS where, instead of reimplementing JS features, the library should provide a small footprint and be easily customizable. An example of what I mean by this would be [raviger](https://github.com/kyeotic/raviger) versus something like [vue-router](https://github.com/vuejs/vue-router). Raviger doesn't implement `beforeRoute`, `beforeEach`, etc. Instead, you can simply put your code before the return statement. Thus, this reduces the complexity of the library while improving performance and making it more flexible.

## The Current Solutions
### No Errors
Some solutions decide to not throws any errors at all. This makes writing clean code, especially with async/await becoming more popular, far more diffuclt.

### Vague Errors
Many current solutions provide vague errors that make generation of human-readable strings and error handling far more difficult than it needs to be.
Many validators ship with built-in types like emails, URLs, UUIDs, etc. with no way to know what they check for, and complicated APIs for defining new types.

### Non-reusable
Almost all current validators provide no way to convert to different libraries at runtime such as Mongoose, Sequelize, Joi, and more. This lack of extensibility makes schemas far harder to reuse and forces developers to rewrite the same schema over many different specifications.

### Performance
⚠️ Place benchmarks here
In comparison to AJV, a library which pre-compiles its schemas, libraries that do not pre-compile their schemas fail to compete in terms of performance. AJV is approximately 50x faster than Joi as a result.

### JSON Schemas
Although useful in some situations, the complexity of JSON schemas often makes them less appealing and more difficult to write in. Thus, the disadvantages generally end up being more significant than the advantages.

### Reimplementing Language Features
Many validation libraries attempt to form their own methods of schema creation for a more "surgary" syntax. For an example of this, one needs to look no further than Joi. However, this ends up forcing the developer to learn a larger API for the sake of reimplementing features that already exist in a language. Instead, `schemaa` will stay true to using objects and native types to reduce the size of the API.

Goals
Unopionated
Useful errors
Similar API
Custom Types
Pre-compilation

# How?
## Errors
Inherits from `Error`. Inspired by `superstruct` and `Joi`.
```js
{
  name: "Error", // Inherited from Error
  message: String // Inherited from Error
  failures: [
    {
      path: String[], // Array of keys leading up the inheritance chain
      key: String, // Key of the object that failed
      value: "any", // The value that failed the validation, any type
      message: "", // Generated message containing information on the error
      type: "any" // The type of the expected value
    }
  ]
}
```
### Simple yet Informative
The errors thrown by the library should provide all the necessary information for converting them into readable strings to be passed to the user. However, they must also remain simple in nature and be self-explanatory. Reading through docs to understand an error structure is ridiculous. For examples of good error patterns, we don't have to look any further than superstruct. However, `superstruct` itself is incredibly simple and does not consider ways of communicating what part of the validation failed. For example, if a string needs to be of a certain length, this information needs to be communicated to the developer in a predictable and handleable manner.

This issue could be resolved by passing the key of the property that caused the error to occur. Currently, a `type` property is being passed in the failure. However, this could be replaced by an object that contains more information on the error. This could be the key (i.e. minimum) and its value (8). What other information could be passed? Do we keep the type property anyway? I suppose it would be helpful to know the type in cases where minimum means something very different for a number and a string.

### Consistency
The goal of the error is to provide a consistent way to handle errors. Joi struggled with the issue of having many special cases where extra values would be passed. This made error handling an unneccessarily complicated process. Consistency along with the informative nature of the error allows developer to easily form human readable strings. However, consistency poses the issue of failing to support edge cases. Finding a schema that can handle the vast majority of cases will take some more research and testing. This was the reason Joi added so many special properties.

### Extendable?
Making the error class extendable would allow for further customization for UserInputError, NotFoundError, or so on however this may be disruptive to the consistency of the error schema. I need to perform more research on this.
