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
