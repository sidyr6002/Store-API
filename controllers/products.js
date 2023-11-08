const asyncHanlder = require("express-async-handler");
const AppError = require(`../middleware/appError`);
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
    const regex = /(\w+)\s*([><]=?|=)\s*([\d.]+)/;
    const [, field, operator, value] = query.match(regex);
    const mongoOperator = operatorMap[operator];

    return [field, mongoOperator, value];
}

// ---------------------------------------------------------------------------------

const getAllProductsStatic = asyncHanlder(async (req, res) => {
    // throw new AppError(400, "Can't wait");
    console.log(req.query.text);

    const products = await Product.find({
        $text: { $search: req.query.text },
    });
    
    res.status(200).json({ products, nbHits: products.length });
});

// Adding all kind of filters that may be required in API building
const getAllProducts = asyncHanlder(async (req, res) => {
    const {
        name,
        featured,
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
    if (name) filter.name = { $regex: name, $options: "i" }; // i is for the case insensitive matching
    if (featured) filter.featured = featured;
    if (createdAt) filter.createdAt = createdAt;
    if (company) filter.company = company;

    const result = Product.find(filter);

    // Extra filtering for the result
    // The filters are entered in format: price, name, company......
    if (sort) { 
        const sortList = sort.split(",").join(" ");
        result.sort(sortList);
    }

    if (feilds) { 
        const feildList = feilds.split(",").join(" ");
        result.select(feildList);
    }

    // Pagination Filtering. Default values for the limit is 10 and skip is 0 
    const setLimit = parseInt(limit) || 10;
    const setPage = parseInt(page) || 1;
    const setSkip = (setPage - 1) * setLimit;
    result.skip(setSkip).limit(setLimit);

    // The numeric filters are only applied on price and rating. As they are the only numerinc fileds in the Schema
    if (numericFilters) {
        const filter = {};
        const queries = numericFilters.split(",");
        const options = ["price", "rating"];

        queries.forEach((query) => {
            const [field, operator, value] = parseQuery(query);

            if (options.includes(field)) {
                if (!filter[field]) {
                    filter[field] = {};
                }

                filter[field][operator] = parseFloat(value);
            }
        });

        console.log("filter for numeric values: ", filter);
        result.find(filter);
    }

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
});

module.exports = {
    getAllProductsStatic,
    getAllProducts,
};
