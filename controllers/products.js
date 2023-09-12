const asyncHanlder = require("express-async-handler");
const Product = require(`../models/product`);
// -------------------------------- Operator Filters -------------------------------
const operatorMap = {
    ">": "$gt",
    ">=": "$gte",
    "<": "$lt",
    "<=": "$lte",
    "=": "$eq",
};

function parseQuery(query) {
    const regex = /(\w+)\s*([><=]{1,2})\s*([\d.]+)/;
    const [,field, operator, value] = query.match(regex);
    const mongoOperator = operatorMap[operator];

    return [field, mongoOperator, value];
}

// ---------------------------------------------------------------------------------

const getAllProductsStatic = asyncHanlder(async (req, res) => {
    const products = await Product.find({ price: { $gte: 40 }, rating: '5' })
        .select("name price rating")
        .sort("price");
    res.status(200).json({ products, nbHits: products.length });
});

const getAllProducts = asyncHanlder(async (req, res) => {
    const {
        name,
        price,
        featured,
        rating,
        createdAt,
        company,
        sort,
        feilds,
        limit,
        page,
        numericFilters,
    } = req.query;
    const filter = {};

    // Filtering based on schema feilds
    if (name) filter.name = { $regex: name, $options: "i" };
    if (price) filter.price = price;
    if (featured) filter.featured = featured;
    if (rating) filter.rating = rating;
    if (createdAt) filter.createdAt = createAt;
    if (company) filter.company = company;

    const result = Product.find(filter);

    // Extra filtering for the result
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result.sort(sortList);
    }

    if (feilds) {
        const feildList = feilds.split(",").join(" ");
        result.select(feildList);
    }

    const setLimit = parseInt(limit) || 10;
    const setPage = parseInt(page) || 1;
    const setSkip = (setPage - 1) * setLimit;
    result.skip(setSkip).limit(setLimit);

    if (numericFilters) {
        const filter = {};
        const queries = numericFilters.split(",");
        const options = ['price', 'rating']

        queries.forEach((query) => {
            const [field, operator, value] = parseQuery(query);
            
            if (options.includes(field)) {
                if(!filter[field]) {
                    filter[field] = {}
                }

                filter[field][operator] = parseFloat(value);
            }
        });

        console.log('filter for numeric values: ',filter)
        result.find(filter)
    }

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
});

module.exports = {
    getAllProductsStatic,
    getAllProducts,
};
