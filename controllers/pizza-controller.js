const { Pizza } = require('../models');

const pizzaController = {
    // get all pizzas - getAllPizza method
    //callback function for the GET /api/pizzas route
    getAllPizza(req, res) {
        Pizza.find({})
            .populate({           // added so with commentID, the comment(s) is populated as well.
                path: 'comments',   //    comments added
                select: '-__v'      //    exclude the __v in the comments
            })                    //    end populate.
            .select('-__v')     //    with excluded __v above.
            .sort({ _id: -1 })      // adding sort() method to sort DESC, to get latest pizza
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // get one pizza by id
    // -- updated to get comments from single pizza
    getPizzaById({ params }, res) {
        console.log(params);
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },



    // createPizza
    // create method for handling POST /api/pizzas to add a pizza to the database
    // destructure the body out of the Express.js req object 
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },


    // update a pizza by id
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },


    // delete pizza
    // request to DELETE /api/pizzas/:id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }

}

module.exports = pizzaController;