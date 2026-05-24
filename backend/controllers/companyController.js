import Company from "../models/Company.js";

// ADD COMPANY
export const addCompany = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Request received`);
  console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - User ID: ${req.user?._id}`);
  
  try {
    const {
      name,
      location,
      foundedOn,
      city,
      logo,
      description,
    } = req.body;

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Request body:`, {
      name,
      location,
      foundedOn,
      city,
      logo: logo ? `${logo.substring(0, 50)}...` : null,
      description: description ? `${description.substring(0, 100)}...` : null
    });

    // validation
    if (!name || !location || !foundedOn || !city) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Validation failed: Missing required fields`);
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Field status - Name: ${!!name}, Location: ${!!location}, FoundedOn: ${!!foundedOn}, City: ${!!city}`);
      
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Request failed - Missing fields (Duration: ${duration}ms)`);
      
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check for duplicate company name
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Checking for existing company with name: ${name}`);
    const existingCompany = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    
    if (existingCompany) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Company already exists with name: ${name} (ID: ${existingCompany._id})`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Request failed - Duplicate company (Duration: ${duration}ms)`);
      
      return res.status(400).json({
        message: "Company with this name already exists",
      });
    }

    // create company
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Creating new company in database`);
    const companyData = {
      name,
      location,
      foundedOn,
      city,
      logo,
      description,
      createdBy: req.user._id,
    };
    
    const company = await Company.create(companyData);
    
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Company created successfully with ID: ${company._id}`);
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Company details:`, {
      id: company._id,
      name: company.name,
      city: company.city,
      createdBy: company.createdBy
    });

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Request completed successfully (Duration: ${duration}ms)`);

    res.status(201).json(company);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Stack trace:`, error.stack);
    console.error(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Error details:`, {
      name: error.name,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue
    });
    
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD COMPANY - Request failed with error (Duration: ${duration}ms)`);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Company with this name already exists",
      });
    }
    
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL COMPANIES
export const getCompanies = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Request received`);
  
  try {
    const search = req.query.search || "";
    const city = req.query.city || "";
    const sort = req.query.sort || "createdAt";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Query parameters:`, {
      search,
      city,
      sort,
      page,
      limit
    });

    // search query
    let query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Applying name search filter: ${search}`);
    }

    if (city) {
      query.city = {
        $regex: city,
        $options: "i",
      };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Applying city filter: ${city}`);
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Final query:`, JSON.stringify(query));

    // sorting
    let sortOption = {};

    if (sort === "name") {
      sortOption = { name: 1 };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Sorting by name (ascending)`);
    } else if (sort === "rating") {
      sortOption = { averageRating: -1 };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Sorting by rating (descending)`);
    } else {
      sortOption = { createdAt: -1 };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Sorting by createdAt (descending)`);
    }

    // Execute queries
    console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Fetching companies from database`);
    
    const [companies, totalCompanies] = await Promise.all([
      Company.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email"),
      Company.countDocuments(query)
    ]);

    console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Found ${companies.length} companies (Total: ${totalCompanies})`);
    
    if (companies.length > 0) {
      console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Sample company IDs:`, 
        companies.slice(0, 3).map(c => ({ id: c._id, name: c.name }))
      );
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Request completed successfully (Duration: ${duration}ms)`);

    res.status(200).json({
      companies,
      pagination: {
        page,
        limit,
        total: totalCompanies,
        pages: Math.ceil(totalCompanies / limit)
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Stack trace:`, error.stack);
    
    console.log(`[${new Date().toISOString()}] [${requestId}] GET COMPANIES - Request failed with error (Duration: ${duration}ms)`);
    
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE COMPANY
export const getSingleCompany = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  const companyId = req.params.id;
  
  console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Request received for company ID: ${companyId}`);
  
  try {
    // Validate company ID format
    if (!companyId || companyId.length !== 24) {
      console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Invalid company ID format: ${companyId}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Request failed - Invalid ID (Duration: ${duration}ms)`);
      
      return res.status(400).json({
        message: "Invalid company ID format",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Fetching company from database`);
    
    const company = await Company.findById(companyId)
      .populate("createdBy", "name email");

    if (!company) {
      console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Company not found with ID: ${companyId}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Request failed - Company not found (Duration: ${duration}ms)`);
      
      return res.status(404).json({
        message: "Company not found",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Company found:`, {
      id: company._id,
      name: company.name,
      city: company.city,
      createdBy: company.createdBy?._id || company.createdBy,
      hasReviews: company.reviews ? company.reviews.length : false
    });

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Request completed successfully (Duration: ${duration}ms)`);

    res.status(200).json(company);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Stack trace:`, error.stack);
    
    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - CastError: Invalid company ID format`);
      return res.status(400).json({
        message: "Invalid company ID format",
      });
    }
    
    console.log(`[${new Date().toISOString()}] [${requestId}] GET SINGLE COMPANY - Request failed with error (Duration: ${duration}ms)`);
    
    res.status(500).json({
      message: error.message,
    });
  }
};