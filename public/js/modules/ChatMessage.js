// the export statement means that everything inside the curly braces 
// will be made public when you import this file into another via the import statement

export default {
    props: ['msg'],

    template: `
        <p class="new-message" :class="{ 'my-message' : matchedID, 'console' : isConsole }">
            <span>{{msg.message.name}}:</span>
            {{msg.message.content}}
        </p>
    `,

    data: function() {
        console.log(this.msg.message.name == "Console");
        return { 
            matchedID: this.$parent.socketID == this.msg.id,
            isConsole: this.msg.message.name == "Console" // Determines if a consoole message or not for styling
        };
    }
}