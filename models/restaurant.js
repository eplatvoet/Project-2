module.exports = function(sequelize, DataTypes) {
    const Restaurant = sequelize.define("Restaurant", {
        latitude: {
            type: DataTypes.DECIMAL(12,6),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(12,6),
            allowNull: false,
        },
        shop_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address : {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,150]
            }
        },
        neighborhood : {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1,150]
            }
        },
        hours : {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1,200]
            }
        },
        cost_for_two : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        shop_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        cuisines: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        highlights: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        shop_image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        user_review: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1,100]
            }
        },
        user_rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isNumeric: true, // add smileys
            }
        },
    });
    
    // need to ask if we ever need foreign key, or is having only onDelete cascade is fine.
    Restaurant.associate = function(models) {
        Restaurant.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Restaurant;
}