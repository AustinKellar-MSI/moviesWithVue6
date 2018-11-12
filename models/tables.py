db.define_table('movies',
                Field('title'),
                Field('description', 'text'),
                Field('rating')
                )

db.define_table('comments',
                Field('movie_id', "reference_movies"),
                Field('body', 'text')
                )