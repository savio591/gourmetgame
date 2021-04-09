const readline = require("readline")
var cli = readline.createInterface(process.stdin, process.stdout)

// direct stout will skip the '\n' readline listener
var stdout = process.stdout

const adjectives = [
    {
        adj_id: 0,
        adj: "massa"
    },
    {
        adj_id: 1,
        adj: "frutas"
    },
    {
        adj_id: 2,
        adj: "doces"
    },
    {
        adj_id: 3,
        adj: "salgados"
    }
]

const dishes = [
    {
        id: -1,
        dish: "Bolo de Chocolate",
        adj_id: -1
    },
    {
        id: 1,
        dish: "Lazanha",
        adj_id: 0
    },
    {
        id: 2,
        dish: "Arroz",
        adj_id: 0
    },
    {
        id: 3,
        dish: "Maçã",
        adj_id: 1
    },
    {
        id: 4,
        dish: "Pudim",
        adj_id: 2
    },
    {
        id: 5,
        dish: "Coxinha",
        adj_id: 3
    }


]

class Find {
    adj(adjId) {
        const { adj: adj_name } = adjectives.find(a => a.adj_id === adjId)
        return adj_name
    }

    dish(adjId, dishId) {
        const findAdjectiveIndex = adjectives.findIndex(a => a.adj_id === adjId)
        const adjDishes = dishes.filter(d => d.adj_id === findAdjectiveIndex)
        const { dish } = adjDishes[dishId]
        return dish
    }
}

function addDish(newDish) {
    const { dish, adjective } = newDish
    const findAdjIndex = adjectives.findIndex(adj => (adj.adj === adjective))
    if ((findAdjIndex === -1)) {
        adjectives.push({
            adj_id: adjectives.length + 1,
            adj: adjective
        })
    }
    dishes.push({
        id: dishes.length + 1,
        dish,
        adj_id: findAdjIndex
    })
}

function optionCode(str) {
    let optionCode = -1

    if (str.includes("n")) optionCode = 0
    if (str.includes("s")) optionCode = 1
    return optionCode
}

// Press a table in console with the database
function showDatabase() {
    const database = []
    for (i = 0; adjectives.length > i; i++) {

        const findDishes = dishes.filter(dish => (i === dish.adj_id))
        database.push({
            adjective: adjectives[i].adj,
            dishes: findDishes.map(d => d.dish)
        })
    }
    console.table(database)
}

function Game() {
    const find = new Find()
    // init the operators
    let questionType = 0 // initial, adj, dish, pass, new"
    let option = 0 // no, yes
    let actualAdj = 0
    let actualDish = 0
    let waitInput = 0
    let waitNewDish = 0

    if (questionType === 0) {
        stdout.write("Pense em um prato que gosta\n> ");
        questionType++
    }

    // cli.on will create a looop at each '\n'
    // cli.on criará um loop a cada \n, ou seja, a entrada "enter"
    cli.on('line', line => {
        option = optionCode(line)
        console.log({
            questionType, waitInput, option, actualAdj
        })


        // operatotrs manager
        questionType += ((questionType === 2) & option === 1) ? 1 : 0
        questionType += ((questionType === 1) & option === 1) ? 1 : 0

        actualAdj += ((questionType === 1) & option === 0) ? 1 : 0
        actualDish += ((questionType === 2) & option === 0) ? 1 : 0


        try {
            // questions manager
            switch (questionType) {
                case (1): // print the adjective mode question
                    console.log("10")
                    stdout.write(`o prato que você escolheu é ${find.adj(actualAdj)}?\n> `)
                    break
                case (2): // print the dish mode question
                    console.log("20")
                    stdout.write(`O prato que você pensou é ${find.dish(actualAdj, actualDish)}?\n> `)
                    break
                case (3): // print the pass mode
                    console.log(`Aê carai?`)
                    showDatabase()
                    cli.close()
                    break
            }
        }

        // if not find a dish or adjective
        catch (err) {
            stdout.write("Desisto\n\n")
            stdout.write(`O prato que você pensou é ${find.dish(-1, 0)}?\n> `)
            




        }


    })
}

Game()
