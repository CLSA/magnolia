<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_agreement;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    // add the total number of reqns
    if( $select->has_column( 'reqn_count' ) )
    {
      // We can't use parent::add_count_column() since there is no directly relationship between
      // data agreement and reqn
      $join_sel = lib::create( 'database\select' );
      $join_sel->from( 'data_agreement' );
      $join_sel->add_column( 'id', 'data_agreement_id' );
      $join_sel->add_column(
        'IF( reqn_current_reqn_version.reqn_id IS NOT NULL, COUNT(*), 0 )',
        'reqn_count',
        false
      );

      $join_mod = lib::create( 'database\modifier' );
      $join_mod->left_join( 'reqn_version', 'data_agreement.id', 'reqn_version.data_agreement_id' );
      $join_mod->left_join(
        'reqn_current_reqn_version',
        'reqn_version.id',
        'reqn_current_reqn_version.reqn_version_id'
      );
      $join_mod->group( 'data_agreement.id' );

      $modifier->left_join(
        sprintf( '( %s %s ) AS data_agreement_join_reqn', $join_sel->get_sql(), $join_mod->get_sql() ),
        'data_agreement.id',
        'data_agreement_join_reqn.data_agreement_id' );
      $select->add_column( 'IFNULL( reqn_count, 0 )', 'reqn_count', false );
    }

    $db_data_agreement = $this->get_resource();
    if( !is_null( $db_data_agreement ) )
    {
      if( $select->has_column( 'filename' ) )
      {
        $select->add_constant(
          basename( $db_data_agreement->get_data_filename() ),
          'filename'
        );
      }
    }
  }
}
