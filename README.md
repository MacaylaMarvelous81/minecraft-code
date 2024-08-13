# Block Coding for Minecraft
Blockly for Minecraft: Bedrock Edition. Connects via WebSocket, like the old
Minecraft Code Connection.
**NOT AN OFFICIAL MINECRAFT PROGRAM. NOT APPROVED BY OR ASSOCIATED WITH
MOJANG OR MICROSOFT.**

## References
These resources aided in the development of this project by shedding light on
how the Minecraft features utilized in this project work!

- [mcwss by Sandertv, forked by faishasj](https://github.com/faishasj/mcwss)  
mcwss is _the_ WebSocket library for Minecraft: Bedrock Edition. It's packed
with features and is a pleasure to use! The repository linked here is a fork
which implements the new `ws:encrypt` purpose and is the only example I could
find of it! Though encrypted websockets are not currently supported, I hope to
implement them soon.
- [The Minecraft Wiki](https://minecraft.wiki)  
The Minecraft Wiki documents commands that are hidden and cannot be used
normally, such as the `agent` and `querytarget` commands. Though these commands
understandably have little documentation  and sometimes even are missing
subcommands, the wiki is still very helpful, and I try to edit the pages if I
notice it is missing information.
- [Minecraft - Microsoft MakeCode](https://minecraft.makecode.com)  
The official MakeCode editor for Minecraft Code Connection. Though Code
Connection is deprecated and no longer officially works with newer versions,
it is still a great reference for what kind of blocks to implement in this
project.