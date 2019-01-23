<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\graduate;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    if( 300 > $this->get_status()->get_code() )
    {
      $db_graduate = $this->get_resource();
      if( !is_null( $db_graduate ) )
      {
        $db_user = lib::create( 'database\user', $db_graduate->user_id );

        if( $db_graduate->user_id == $db_graduate->graduate_user_id )
        {
          $this->set_data( 'You cannot make a user be a graduate of themselves.' );
          $this->get_status()->set_code( 306 );
        }
        else if( $db_user->is_graduate() )
        {
          $this->set_data( 'This user cannot have a graduate student since they are graduate student themselves.' );
          $this->get_status()->set_code( 306 );
        }
      }
    }
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'user', 'graduate.user_id', 'user.id' );
    $modifier->join( 'user', 'graduate.graduate_user_id', 'graduate_user.id', '', 'graduate_user' );

    if( $select->has_column( 'user_full_name' ) )
    {
      $select->add_table_column(
        'user',
        'CONCAT_WS( " ", user.first_name, user.last_name )',
        'user_full_name',
        false
      );
    }

    if( $select->has_column( 'graduate_full_name' ) )
    {
      $select->add_table_column(
        'graduate_user',
        'CONCAT_WS( " ", graduate_user.first_name, graduate_user.last_name )',
        'graduate_full_name',
        false
      );
    }
  }
}
