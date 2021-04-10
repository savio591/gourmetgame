const readline = require("readline")
var cli = readline.createInterface(process.stdin, process.stdout)

// direct stout will skip the '\n' readline listener
var stdout = process.stdout

const adjectives = [
    {
        adj_id: 0,
        adj: "massa"
    }
]

const dishes = [
    {
        id: -1,
        dish: "Bolo de Chocolate",
        adj_id: -1
    },
    {
        id: 0,
        dish: "Lazanha",
        adj_id: 0
    }
]

// Print Data for debuggers
class Print {
    printTable() {
        const database = []
        for (let i = 0; adjectives.length > i; i++) {
            const findDishes = dishes.filter(dish => (i === dish.adj_id))
            database.push({
                adjective: adjectives[i].adj,
                dishes: findDishes.map(d => d.dish)
            })
        }
        console.table(database)
    }
    printObj() {
        console.log({ adjectives, dishes })
    }
}

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
    let findAdjIndex = adjectives.findIndex(adj => (adj.adj === adjective))

    if ((findAdjIndex === -1)) {
        findAdjIndex = adjectives.length
        adjectives.push({
            adj_id: findAdjIndex,
            adj: adjective
        })
    }

    dishes.push({
        id: dishes.length - 1,
        dish,
        adj_id: findAdjIndex
    })
}


function Game() {
    const find = new Find()
    const print = new Print()
    // init the operators     -1     0      1    2     3     4      5        6
    let questionType = 0 // void, initial, adj, dish, pass, cake, newDish, newAdj"
    let actualAdj = 0
    let actualDish = 0
    let waitInput = 0 // wait input by type 0 = nothing, 1 = adj/dish input, 2 = endgame input, 3 = new adj/dish

    let optionCode = (str) => {
        let code = -1
        if (str.includes("n")) code = 0 // note that string method is relative
        if (str.includes("s")) code = 1
        return code
    }

    let newDish = {
        dish: "",
        adjective: ""
    }

    // first print without need to insert \n
    stdout.write("Pense em um prato que gosta\n> ");
    questionType++

    // cli.on will create a looop at each '\n'
    cli.on('line', line => {
        option = optionCode(line)

        // questions operators
        questionType += ((
            questionType === 2 ||
            questionType === 1) & option === 1 &
            waitInput === 1) ? 1 : 0

        actualAdj += (questionType === 1 & option === 0 & waitInput === 1) ? 1 : 0
        actualDish += (questionType === 2 & option === 0 & waitInput === 1) ? 1 : 0

        // new adj/dish conditions
        if (waitInput >= 4) {
            switch (questionType) {
                case 6:
                    newDish.adjective = line
                    questionType = 3
                    addDish(newDish)
                    break
                case 5:
                    newDish.dish = line
                    questionType++
                    break
            }
        }

        // no more dish/adj condition
        if (questionType === 4 & waitInput === 3) {
            switch (option) {
                case 0:
                    questionType++
                    break
                case 1: questionType = 3
                    break
            }
        }

        // endgame conditions
        if (questionType === 3 & waitInput === 2) {
            switch (option) {
                case 0:
                    questionType = -1
                    actualDish = 0
                    actualAdj = 0
                    waitInput = 0
                    option = -1
                    cli.close()
                    break
                case 1:
                    questionType = 0
                    actualDish = 0
                    actualAdj = 0
                    waitInput = 0
                    option = -1
                    break
            }
        }

        // questions manager
        try {
            switch (questionType) {
                case (0):
                    stdout.write("Pense em um prato que gosta\n> ")
                    questionType++
                    break
                case (1): // print the adjective mode question
                    stdout.write(`o prato que você escolheu é ${find.adj(actualAdj)}?\n> `)
                    waitInput = 1
                    break
                case (2): // print the dish mode question
                    stdout.write(`O prato que você pensou é ${find.dish(actualAdj, actualDish)}?\n> `)
                    waitInput = 1
                    break
                case (3): // print the pass mode
                    stdout.write(`Acertei!\nQuer jogar denovo?\n> `)
                    waitInput = 2
                    break
                case (4): // print the cake mode
                    stdout.write(`O prato que você pensou é ${find.dish(-1, 0)}?\n> `)
                    waitInput = 3
                    break
                case (5): // print the new dish mode
                    stdout.write(`Qual prato você pensou?\n> `)
                    waitInput++
                    break
                case (6): // print the new dish mode
                    stdout.write(`${newDish.dish} é _____, mas bolo de chocolate não.\n> `)
                    waitInput++
                    break
            }
        }

        catch (err) {
            questionType = 4
            cli.write('\n')
        }
    })
}

Game()
