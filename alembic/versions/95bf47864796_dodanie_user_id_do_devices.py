"""dodanie user_id do devices

Revision ID: 95bf47864796
Revises: 
Create Date: 2025-04-14 14:24:41.296417

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '95bf47864796'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devices', sa.Column('owner_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'devices', 'users', ['owner_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'devices', type_='foreignkey')
    op.drop_column('devices', 'owner_id')
    # ### end Alembic commands ###
